"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  BufferGeometry,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";
import { applyShapeColors, createShapeLights, createShapeMaterials } from "@/components/shapeStyle";
import {
  HERO_ENTRANCE_MS,
  PLACEMENT_MS,
  PORTRAIT_ASPECT,
  POINTER_SHIFT,
  SHAPE_OPACITY,
  UNIT_SHARE,
  blobs,
  collectTextRects,
  fitPlacements,
  heroEntrance,
  heroPlacements,
  pointerCurrent,
  pointerTarget,
  type Placement,
} from "@/components/shapesScene";

const POINTER_EASING = 0.06;
const MAX_PIXEL_RATIO = 1.5;
// A narrow field of view from far away: same framing as a wide lens up close, but with little
// perspective, so the shapes keep their proportions wherever they sit on screen.
const CAMERA_Z = 30;
const CAMERA_FOV = 12;

const SCENE_OPACITY = 1;

// Entrance: each shape fades in until it reaches its form, at the pace of the text (same duration), one
// after another from the top down, the last one landing when the text finishes (HERO_ENTRANCE_MS).
// Order of `blobs`: ring, knot, wine sphere, small sphere.
const FADE_MS = 1300;
const FADE_STARTS = [0, HERO_ENTRANCE_MS - FADE_MS, 500, 950];

// The scene fades out over the first stretch of scroll, as a fraction of the viewport height.
const FADE_DISTANCE = 0.45;

// Decorative and mouse-reactive only with a fine pointer and no reduced-motion preference; with
// reduced motion the scene is drawn once and never animated. Its opacity follows the scroll position
// directly (no timed transition), so it fades as fast as you scroll and never lags. The layer is portaled
// to <body> and fixed to the viewport: the hero clips its own overflow (and is translated, which would
// also re-anchor a fixed child), and this way the scene runs under the sticky header too. It sits
// just above the glow and the hero's bottom fade (both -z-10), so neither washes the shapes out.
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

    const lights = createShapeLights(scene);
    const materials = createShapeMaterials(SHAPE_OPACITY);

    const unitSphere = new SphereGeometry(1, 48, 48);
    const geometries: BufferGeometry[] = [unitSphere];
    const meshes: Mesh[] = [];
    // Each shape has its own copy of its tone's material, so it can fade on its own.
    const shapeMaterials = blobs.map((blob) => materials[blob.tone].clone());
    shapeMaterials.forEach((material) => (material.transparent = true));
    const groups = blobs.map((blob) => {
      const group = new Group();
      let geometry: BufferGeometry = unitSphere;
      if (blob.shape === "torus") geometry = new TorusGeometry(1, 0.42, 48, 96);
      if (blob.shape === "knot") geometry = new TorusKnotGeometry(1, 0.38, 200, 32, 2, 3);
      if (geometry !== unitSphere) geometries.push(geometry);
      const mesh = new Mesh(geometry, shapeMaterials[blobs.indexOf(blob)]);
      mesh.scale.setScalar(blob.radius);
      group.add(mesh);
      meshes.push(mesh);
      scene.add(group);
      return group;
    });

    const applyColors = () => {
      applyShapeColors(materials, lights);
      shapeMaterials.forEach((material, index) => {
        const base = materials[blobs[index].tone];
        material.color.copy(base.color);
        material.sheenColor.copy(base.sheenColor);
      });
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let unit = 1;
    let halfWidth = 1;
    let halfHeight = 1;
    // Where each shape is drawn (`displayed`) glides, through anime.js, to where the layout wants it (`targets`).
    const targets: Placement[] = blobs.map((blob) => ({ x: blob.anchor[0], y: blob.anchor[1], radius: blob.radius }));
    const displayed: Placement[] = targets.map((place) => ({ ...place }));
    heroPlacements.current = targets;
    let glides: JSAnimation[] = [];
    let laidOut = false;

    // Entrance: `faded` is 0..1 per shape (see FADE_STARTS). The delays are counted from when the hero's text
    // started, and the shapes mount later (Three.js loads separately), so what has already passed is cut off.
    const faded = blobs.map(() => ({ value: 0 }));
    const fades: JSAnimation[] = [];
    if (motionQuery.matches) {
      const elapsed = heroEntrance.startedAt ? performance.now() - heroEntrance.startedAt : 0;
      faded.forEach((shape, index) => {
        const start = Math.max(FADE_STARTS[index] - elapsed, 0);
        const duration = Math.max(FADE_STARTS[index] + FADE_MS - elapsed - start, 300);
        fades.push(animate(shape, { value: 1, duration, delay: start, ease: "inOutQuad" }));
      });
    } else {
      for (const shape of faded) shape.value = 1;
    }

    const draw = (seconds: number) => {
      const time = motionQuery.matches ? seconds : 0;
      groups.forEach((group, index) => {
        const blob = blobs[index];
        // Farther shapes (lower z) move less with the pointer, which reads as depth.
        const depth = 1 + blob.z * 0.3;
        group.scale.setScalar(unit);
        // A slow sway around the resting tilt, never a full turn: a ring that keeps spinning ends up
        // edge-on, where it reads as a pill.
        group.rotation.x = blob.tilt[0] + Math.sin(time * 0.25) * blob.drift * 3;
        group.rotation.y = blob.tilt[1] + Math.sin(time * 0.2 + 1) * blob.drift * 2;
        const place = displayed[index];
        meshes[index].scale.setScalar(place.radius);
        group.position.set(
          place.x * halfWidth - current.x * POINTER_SHIFT * depth,
          place.y * halfHeight - current.y * POINTER_SHIFT * depth + Math.sin(time * 0.5 + index * 1.7) * 0.06,
          blob.z,
        );
        shapeMaterials[index].opacity = SHAPE_OPACITY * faded[index].value;
        shapeMaterials[index].visible = faded[index].value > 0.001;
      });
      renderer.render(scene, camera);
    };

    const tick = (time: number) => {
      current.x += (target.x - current.x) * POINTER_EASING;
      current.y += (target.y - current.y) * POINTER_EASING;
      pointerCurrent.x = current.x;
      pointerCurrent.y = current.y;
      draw(time / 1000);
      frame = requestAnimationFrame(tick);
    };

    // Runs the loop only while it can be seen and wanted; otherwise draws a single still frame.
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (motionQuery.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
      else draw(0);
    };

    // Moves the drawn placements to the targets: the first layout, and any with reduced motion, snap;
    // later ones (the text was measured again, or the screen was resized) glide.
    const glideToTargets = () => {
      for (const glide of glides) glide.cancel();
      if (!laidOut || !motionQuery.matches) {
        displayed.forEach((place, index) => Object.assign(place, targets[index]));
        glides = [];
        laidOut = true;
        return;
      }
      glides = displayed.map((place, index) =>
        animate(place, { ...targets[index], duration: PLACEMENT_MS, ease: "outExpo" }),
      );
    };

    // Smoothstep of the scroll position, so the fade eases in and out instead of tracking linearly.
    const fade = () => {
      const progress = MathUtils.clamp(window.scrollY / (window.innerHeight * FADE_DISTANCE), 0, 1);
      layer.style.opacity = String(SCENE_OPACITY * (1 - MathUtils.smoothstep(progress, 0, 1)));
      const wasVisible = visible;
      visible = progress < 1;
      if (visible !== wasVisible) sync();
    };

    // Places every shape from its viewport anchor and sizes it from the viewport, so the composition
    // holds on a wide desktop and on a phone alike.
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      halfHeight = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2)) * CAMERA_Z;
      halfWidth = halfHeight * camera.aspect;
      unit = Math.min(halfHeight, halfWidth * 0.7) * UNIT_SHARE;
      const textColumn = document.querySelector("#hero h1")?.parentElement;
      const fitted: Placement[] =
        camera.aspect < PORTRAIT_ASPECT && textColumn
          ? fitPlacements(collectTextRects(textColumn), width, height, unit * (height / (2 * halfHeight)))
          : blobs.map((blob) => ({ x: blob.anchor[0], y: blob.anchor[1], radius: blob.radius }));
      fitted.forEach((place, index) => Object.assign(targets[index], place));
      glideToTargets();
      sync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerTarget.x = target.x;
      pointerTarget.y = target.y;
    };

    applyColors();
    resize();
    fade();
    // The text moves while the hero's entrance runs and its size changes once the fonts load, so measure again.
    void document.fonts?.ready.then(resize);
    const settleTimer = window.setTimeout(resize, 3000);

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
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      for (const glide of glides) glide.cancel();
      for (const fade of fades) fade.cancel();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", fade);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      shapeMaterials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return createPortal(
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-5 opacity-0"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>,
    document.body,
  );
}
