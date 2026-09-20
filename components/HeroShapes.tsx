"use client";

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
  Vector3,
  WebGLRenderer,
} from "three";
import { applyShapeColors, createShapeLights, createShapeMaterials } from "@/components/shapeStyle";

const POINTER_EASING = 0.06;
const MAX_PIXEL_RATIO = 1.5;
// A narrow field of view from far away: same framing as a wide lens up close, but with little
// perspective, so the shapes keep their proportions wherever they sit on screen.
const CAMERA_Z = 30;
const CAMERA_FOV = 12;

// Rounded 3D forms (a ring, a knot, spheres) that bleed off the corners of the hero, in the same
// material and colours as the menu (see shapeStyle.ts). `anchor` is the shape's center in normalized
// viewport coordinates (-1..1, y up), so values near ±1 push it partly off screen; `radius` scales the
// shape in blob units (one unit is UNIT_SHARE of the viewport). Kept abstract on purpose: elongated
// tubes next to spheres read as anatomy.
type Blob = {
  anchor: [number, number];
  z: number;
  radius: number;
  shape: "sphere" | "torus" | "knot";
  tilt: [number, number];
  drift: number;
  tone: 0 | 1;
};

const blobs: Blob[] = [
  // A big ring bleeding off the top-left, with a small sphere tucked in front of it.
  { anchor: [-0.86, 0.5], z: 0, radius: 1.3, shape: "torus", tilt: [0.55, 0.3], drift: 0.08, tone: 0 },
  { anchor: [-0.63, 0.13], z: 0.9, radius: 0.3, shape: "sphere", tilt: [0, 0], drift: 0, tone: 1 },
  // A small sphere on its own on the right, far behind, between the top controls and the knot.
  { anchor: [0.88, 0.32], z: -1, radius: 0.4, shape: "sphere", tilt: [0, 0], drift: 0, tone: 0 },
  // The knot, cut by the bottom-right corner.
  { anchor: [0.82, -0.52], z: 0.2, radius: 0.85, shape: "knot", tilt: [0.3, 0.8], drift: -0.06, tone: 1 },
];

// One blob unit, as a fraction of the smaller of the viewport's height and 0.7 of its width.
const UNIT_SHARE = 0.3;
const POINTER_SHIFT = 0.3;

const SCENE_OPACITY = 1;
// How solid the shapes are; below 1 the hero's glow shows through them.
const SHAPE_OPACITY = 0.68;

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

    const lights = createShapeLights(scene);
    const materials = createShapeMaterials(SHAPE_OPACITY);

    const unitSphere = new SphereGeometry(1, 48, 48);
    const geometries: BufferGeometry[] = [unitSphere];
    const groups = blobs.map((blob) => {
      const group = new Group();
      let geometry: BufferGeometry = unitSphere;
      if (blob.shape === "torus") geometry = new TorusGeometry(1, 0.42, 48, 96);
      if (blob.shape === "knot") geometry = new TorusKnotGeometry(1, 0.38, 200, 32, 2, 3);
      if (geometry !== unitSphere) geometries.push(geometry);
      const mesh = new Mesh(geometry, materials[blob.tone]);
      mesh.scale.setScalar(blob.radius);
      group.add(mesh);
      scene.add(group);
      return group;
    });
    const bases = blobs.map(() => new Vector3());

    const applyColors = () => applyShapeColors(materials, lights);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let unit = 1;

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
        group.position.set(
          bases[index].x - current.x * POINTER_SHIFT * depth,
          bases[index].y - current.y * POINTER_SHIFT * depth + Math.sin(time * 0.5 + index * 1.7) * 0.06,
          bases[index].z,
        );
      });
      renderer.render(scene, camera);
    };

    const tick = (time: number) => {
      current.x += (target.x - current.x) * POINTER_EASING;
      current.y += (target.y - current.y) * POINTER_EASING;
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
      const halfHeight = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2)) * CAMERA_Z;
      const halfWidth = halfHeight * camera.aspect;
      unit = Math.min(halfHeight, halfWidth * 0.7) * UNIT_SHARE;
      blobs.forEach(({ anchor: [x, y], z }, index) => bases[index].set(x * halfWidth, y * halfHeight, z));
      sync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

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
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", fade);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      geometries.forEach((geometry) => geometry.dispose());
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
