"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AmbientLight,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

const POINTER_EASING = 0.06;
const MORPH_EASING = 0.07;
const MAX_PIXEL_RATIO = 1.5;
// A narrow field of view from far away: same framing as a wide lens up close, but with little
// perspective, so a piece moved toward the camera (the "A" crossbar) is not pushed sideways.
const CAMERA_Z = 30;
const CAMERA_FOV = 12;
const PATH_POINTS = 28;
const TUBE_SEGMENTS = 160;

type Point = [number, number, number];

// Soft, glossy organic volumes that bleed off the edges of the hero: thick bent tubes (capsules)
// and a sphere. `anchor` is the blob's center in normalized viewport coordinates (-1..1, y up), so
// values near ±1 push it partly off screen. `path` is a centerline in blob units (one unit is
// UNIT_SHARE of the viewport); without a path the blob is a sphere. `radius` is in the same units.
//
// Hovering the name gathers the blobs into the initials "RA" to its left. Every tube also has a
// `letter` stroke: a few control points (resampled to PATH_POINTS) in a shared letter frame (y up, letters about 2 tall; the strokes sit at different depths so they overlap in front of each other),
// which its scattered path morphs into point by point. The sphere becomes the trailing dot.
type Blob = {
  anchor: [number, number];
  z: number;
  radius: number;
  path?: Point[];
  letter?: Point[];
  tilt: number;
  drift: number;
  tone: 0 | 1;
};

const blobs: Blob[] = [
  {
    anchor: [-0.82, 0.72], z: 0, radius: 0.42, tilt: 0.2, drift: 0.05, tone: 0,
    path: [[-1.3, 0.5, 0], [-0.4, 0.75, 0.2], [0.4, 0.25, 0], [0.9, -0.45, -0.1]],
    // R: the stem.
    letter: [[-1.1, -0.85, 0], [-1.1, 0, 0], [-1.1, 0.85, 0]],
  },
  { anchor: [0.05, 1.08], z: -1, radius: 0.7, tilt: 0, drift: 0.03, tone: 1 },
  {
    anchor: [0.86, 0.55], z: 0.3, radius: 0.4, tilt: -0.25, drift: -0.04, tone: 0,
    path: [[-1, 0.4, 0], [-0.2, 0.75, 0.1], [0.5, 0.3, 0], [1, -0.5, 0.1]],
    // R: the bowl, running on into the leg. It starts inside the stem's top and comes back into
    // the stem's side, so the pieces overlap instead of just touching.
    letter: [[-1.1, 0.85, 0.25], [-0.65, 0.85, 0.25], [-0.4, 0.75, 0.25], [-0.3, 0.5, 0.25], [-0.4, 0.25, 0.25], [-0.65, 0.15, 0.25], [-0.72, 0.02, 0.25], [-0.56, -0.35, 0.25], [-0.3, -0.85, 0.25]],
  },
  {
    anchor: [-0.8, -0.78], z: 0.4, radius: 0.5, tilt: 0.1, drift: 0.04, tone: 1,
    path: [[-1, 0.2, 0], [-0.3, 0.65, 0.1], [0.6, 0.3, 0], [1.1, -0.6, 0.1]],
    // A: the two legs joined by a rounded arch. The arch's radius (about 0.3) stays above the
    // stroke radius, otherwise the tube pinches into a sharp tip at the apex.
    letter: [[-0.1, -0.85, 0.35], [0.03, -0.3, 0.35], [0.17, 0.2, 0.35], [0.28, 0.5, 0.35], [0.5, 0.7, 0.35], [0.72, 0.5, 0.35], [0.83, 0.2, 0.35], [0.97, -0.3, 0.35], [1.1, -0.85, 0.35]],
  },
  {
    anchor: [0.86, -0.58], z: 0, radius: 0.42, tilt: -0.15, drift: -0.05, tone: 0,
    path: [[-0.4, 0.9, 0], [0.3, 0.5, 0.1], [-0.3, -0.3, 0], [0.4, -0.9, 0.1]],
    // A: the crossbar, laid across the legs from center to center and far enough in front (more than
    // the two stroke radii) that it never intersects them: it simply passes over them.
    letter: [[0.03, -0.3, 0.85], [0.97, -0.3, 0.85]],
  },
];

// Letter stroke thickness and the dot's place, in the same letter frame as the strokes above.
const LETTER_RADIUS = 0.22;
const DOT = { position: new Vector3(1.5, -0.8, 0.35), radius: 0.2 };
// Extent of the whole "RA." frame and the horizontal center of that extent, used to fit it to the text block.
const FRAME_WIDTH = 3;
const FRAME_HEIGHT = 2.08;
const FRAME_CENTER_X = 0.2;
// The letters are this share of the text block's height. They are centered in the space to the left
// of the name, keeping this gap (px) from it, and may bleed this far (px) off the left edge if the
// space is tight, like the reference.
const LETTER_HEIGHT_SHARE = 0.55;
const LETTER_GAP = 32;
const LETTER_BLEED = 30;
const NAME_HOVER_PADDING = 12;

// One blob unit, as a fraction of the smaller of the viewport's height and 0.7 of its width.
const UNIT_SHARE = 0.3;
const POINTER_SHIFT = 0.3;

// Kept below full so the scene reads as atmosphere behind the text; raise it for a stronger look.
const SCENE_OPACITY = 0.85;

// The scene fades out over the first stretch of scroll, as a fraction of the viewport height.
const FADE_DISTANCE = 0.45;

// Fine film grain over the scene. An SVG turbulence filter as a data URI: no image file to load.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Decorative and mouse-reactive only with a fine pointer and no reduced-motion preference; with
// reduced motion the scene is drawn once and never animated. Its opacity follows the scroll position
// directly (no timed transition), so it fades as fast as you scroll and never lags. The layer is portaled
// to <body> and fixed to the viewport: the hero clips its own overflow (and is translated, which would
// also re-anchor a fixed child), and this way the scene runs under the sticky header too.
export function HeroShapes() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
    camera.position.z = CAMERA_Z;

    // Glossy but dark: the tight specular streaks come from a low roughness plus clearcoat.
    const ambient = new AmbientLight(0xffffff, 0.35);
    const key = new DirectionalLight(0xffffff, 2.5);
    key.position.set(-4, 5, 5);
    const rim = new DirectionalLight(0xffffff, 1.5);
    rim.position.set(5, -3, 3);
    scene.add(ambient, key, rim);

    const materials = [0, 1].map(
      () =>
        new MeshPhysicalMaterial({
          roughness: 0.6,
          metalness: 0,
          clearcoat: 0.3,
          clearcoatRoughness: 0.45,
          sheen: 1,
          sheenRoughness: 0.35,
        }),
    );

    // Unit sphere shared by the sphere blob and every tube's two rounded ends; scaled to the radius.
    const unitSphere = new SphereGeometry(1, 48, 48);
    const rigs = blobs.map((blob) => {
      const group = new Group();
      const material = materials[blob.tone];
      const body = blob.path
        ? new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(), new Vector3(1, 0, 0)]), 2, 1, 3), material)
        : new Mesh(unitSphere, material);
      group.add(body);
      // Spheres of the tube's radius round off its two open ends.
      const caps = blob.path ? [new Mesh(unitSphere, material), new Mesh(unitSphere, material)] : [];
      caps.forEach((cap) => group.add(cap));
      scene.add(group);

      const scattered = blob.path
        ? new CatmullRomCurve3(blob.path.map(([x, y, z]) => new Vector3(x, y, z))).getSpacedPoints(PATH_POINTS - 1)
        : [];
      const letter = blob.letter
        ? new CatmullRomCurve3(blob.letter.map(([x, y, z]) => new Vector3(x, y, z))).getSpacedPoints(PATH_POINTS - 1)
        : [];
      return { group, body, caps, scattered, letter, builtAt: -1 };
    });
    const bases = rigs.map(() => new Vector3());
    const points = Array.from({ length: PATH_POINTS }, () => new Vector3());

    // Rebuilds one blob for morph progress `t` (0 scattered, 1 lettered). Tubes get a fresh geometry
    // from the interpolated control points; the sphere only changes size and place.
    const shape = (index: number, t: number) => {
      const blob = blobs[index];
      const rig = rigs[index];
      if (Math.abs(t - rig.builtAt) < 0.0004) return;
      rig.builtAt = t;
      if (!blob.path) {
        rig.body.scale.setScalar(MathUtils.lerp(blob.radius, DOT.radius, t));
        rig.body.position.copy(DOT.position).multiplyScalar(t);
        return;
      }
      const radius = MathUtils.lerp(blob.radius, LETTER_RADIUS, t);
      rig.scattered.forEach((point, i) => points[i].lerpVectors(point, rig.letter[i], t));
      const curve = new CatmullRomCurve3(points.map((point) => point.clone()));
      rig.body.geometry.dispose();
      rig.body.geometry = new TubeGeometry(curve, TUBE_SEGMENTS, radius, 32, false);
      rig.caps[0].position.copy(points[0]);
      rig.caps[1].position.copy(points[PATH_POINTS - 1]);
      rig.caps.forEach((cap) => cap.scale.setScalar(radius));
    };

    const applyColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
      const dark = document.documentElement.classList.contains("dark");
      // Dark: the surface tokens are nearly the background colour, so the shapes take the glow
      // tones instead (dusty rose and a wine leaning toward the accent) to stand out from it.
      materials[0].color = token(dark ? "--glow-2" : "--card");
      materials[1].color = dark
        ? token("--glow-1").lerp(token("--accent"), 0.25)
        : token("--glow-1");
      // Sheen lifts the grazing edges toward the tone itself, so the rim fades instead of going black.
      materials.forEach((material) => material.sheenColor.copy(material.color).lerp(new Color(0xffffff), dark ? 0.15 : 0.5));
      key.color = token(dark ? "--highlight" : "--card");
      rim.color = token("--glow-2");
      // A light background needs much more fill so the shaded sides stay soft instead of turning dark.
      ambient.intensity = dark ? 0.8 : 1.6;
      key.intensity = dark ? 2.5 : 1.6;
      rim.intensity = dark ? 1.5 : 0.8;
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const morph = { target: 0, current: 0 };
    let frame = 0;
    let visible = true;
    let unit = 1;
    let letterUnit = 1;
    const letterOrigin = new Vector3();

    const draw = (seconds: number) => {
      const animated = motionQuery.matches;
      const time = animated ? seconds : 0;
      rigs.forEach((rig, index) => {
        const blob = blobs[index];
        // Each blob leaves a little after the previous one, so the gathering feels organic.
        const t = MathUtils.smoothstep(MathUtils.clamp((morph.current - index * 0.06) / 0.76, 0, 1), 0, 1);
        const calm = 1 - t;
        shape(index, t);
        // Farther blobs (lower z) move less with the pointer, which reads as depth.
        const depth = 1 + blob.z * 0.3;
        rig.group.scale.setScalar(MathUtils.lerp(unit, letterUnit, t));
        rig.group.rotation.z = (blob.tilt + time * blob.drift) * calm;
        rig.group.rotation.x = Math.sin(time * 0.2 + index) * 0.15 * calm;
        rig.group.position.set(
          MathUtils.lerp(bases[index].x - current.x * POINTER_SHIFT * depth, letterOrigin.x, t),
          MathUtils.lerp(bases[index].y - current.y * POINTER_SHIFT * depth + Math.sin(time * 0.5 + index * 1.7) * 0.06, letterOrigin.y, t),
          MathUtils.lerp(bases[index].z, letterOrigin.z, t),
        );
      });
      renderer.render(scene, camera);
    };

    const tick = (time: number) => {
      current.x += (target.x - current.x) * POINTER_EASING;
      current.y += (target.y - current.y) * POINTER_EASING;
      morph.current += (morph.target - morph.current) * MORPH_EASING;
      if (Math.abs(morph.target - morph.current) < 0.001) morph.current = morph.target;
      draw(time / 1000);
      frame = requestAnimationFrame(tick);
    };

    // Runs the loop only while it can be seen and wanted; otherwise draws a single still frame.
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (motionQuery.matches && visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      } else {
        morph.target = morph.current = 0;
        draw(0);
      }
    };

    // Smoothstep of the scroll position, so the fade eases in and out instead of tracking linearly.
    const fade = () => {
      const progress = MathUtils.clamp(window.scrollY / (window.innerHeight * FADE_DISTANCE), 0, 1);
      layer.style.opacity = String(SCENE_OPACITY * (1 - MathUtils.smoothstep(progress, 0, 1)));
      const wasVisible = visible;
      visible = progress < 1;
      if (visible !== wasVisible) sync();
    };

    const world = () => {
      const halfHeight = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2)) * CAMERA_Z;
      return { halfHeight, halfWidth: halfHeight * camera.aspect };
    };

    // The name's real text box (the h1 itself is as wide as its column).
    const heading = document.querySelector("#hero h1");
    const range = document.createRange();
    const nameRect = () => {
      if (!heading) return null;
      range.selectNodeContents(heading);
      return range.getBoundingClientRect();
    };

    // Fits "RA." to the left of the name: as tall as (a share of) the whole text block, centered on it
    // vertically and centered horizontally in the free space beside the name. Where there is little room
    // on the left the size follows the room instead. Measured on demand because the text moves
    // while the hero's entrance animation runs.
    const column = heading?.parentElement ?? null;
    const layoutLetters = () => {
      const rect = nameRect();
      const block = column?.getBoundingClientRect();
      if (!rect || !block) return;
      const { halfHeight, halfWidth } = world();
      const unitsPerPixel = (halfWidth * 2) / window.innerWidth;
      const freeWidth = Math.max(rect.left - LETTER_GAP, 0);
      const heightFit = (block.height * LETTER_HEIGHT_SHARE * unitsPerPixel) / FRAME_HEIGHT;
      const widthFit = ((freeWidth + LETTER_BLEED * 2) * unitsPerPixel) / FRAME_WIDTH;
      letterUnit = Math.max(Math.min(heightFit, widthFit), halfHeight * 0.12);
      const centerX = freeWidth / 2;
      letterOrigin.set(
        (centerX / window.innerWidth * 2 - 1) * halfWidth - FRAME_CENTER_X * letterUnit,
        (0.5 - (block.top + block.height / 2) / window.innerHeight) * 2 * halfHeight,
        0,
      );
    };

    // Places every blob from its viewport anchor and sizes it from the viewport, so the composition
    // holds on a wide desktop and on a phone alike.
    const layout = () => {
      const { halfHeight, halfWidth } = world();
      unit = Math.min(halfHeight, halfWidth * 0.7) * UNIT_SHARE;
      blobs.forEach(({ anchor: [x, y], z }, index) => bases[index].set(x * halfWidth, y * halfHeight, z));
      layoutLetters();
    };

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      layout();
      sync();
    };

    const setMorphTarget = (next: 0 | 1) => {
      if (morph.target === next) return;
      if (next === 1) layoutLetters();
      morph.target = next;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;

      const rect = visible ? nameRect() : null;
      const overName =
        !!rect &&
        event.clientX >= rect.left - NAME_HOVER_PADDING &&
        event.clientX <= rect.right + NAME_HOVER_PADDING &&
        event.clientY >= rect.top - NAME_HOVER_PADDING &&
        event.clientY <= rect.bottom + NAME_HOVER_PADDING;
      setMorphTarget(overName ? 1 : 0);
    };
    const onPointerLeave = () => setMorphTarget(0);

    applyColors();
    resize();
    fade();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // The theme class is applied by next-themes after this effect, and again on every toggle.
    const themeObserver = new MutationObserver(() => {
      applyColors();
      if (!frame) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", fade, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", fade);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      rigs.forEach((rig) => {
        if (rig.body.geometry !== unitSphere) rig.body.geometry.dispose();
      });
      unitSphere.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return createPortal(
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-0"
    >
      <canvas ref={canvasRef} className="size-full" />
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>,
    document.body,
  );
}
