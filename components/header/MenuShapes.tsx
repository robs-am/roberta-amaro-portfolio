"use client";

import { useEffect, useRef } from "react";
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

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_Z = 30;
const CAMERA_FOV = 12;
const POINTER_EASING = 0.05;
const POINTER_SHIFT = 0.4;
const UNIT_SHARE = 0.3;

// Same material and colours as the hero shapes (see shapeStyle.ts), with static rounded 3D forms (a ring, a knot, spheres):
// the menu only needs atmosphere behind the big type, so no morphing and no per-frame geometry.
// `anchor` is the center in normalized viewport coordinates (-1..1, y up); `radius` scales the shape
// in blob units. Kept abstract on purpose: elongated tubes next to spheres read as anatomy.
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
  // One cluster in the free space to the right of the items; the pieces overlap in depth.
  { anchor: [0.48, 0.5], z: 0, radius: 0.95, shape: "torus", tilt: [1.1, 0.4], drift: 0.12, tone: 0 },
  { anchor: [0.54, -0.5], z: 0.4, radius: 0.75, shape: "knot", tilt: [0.3, 0.8], drift: -0.1, tone: 1 },
  { anchor: [0.85, 0.1], z: -1, radius: 0.7, shape: "sphere", tilt: [0, 0], drift: 0, tone: 1 },
  { anchor: [0.42, -0.05], z: 0.8, radius: 0.32, shape: "sphere", tilt: [0, 0], drift: 0, tone: 0 },
];

// Decorative layer behind the menu items. Mount it only while the menu is visible: it owns a WebGL
// context and an animation loop, which are torn down on unmount.
export function MenuShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
    camera.position.z = CAMERA_Z;

    const lights = createShapeLights(scene);
    const materials = createShapeMaterials();

    const unitSphere = new SphereGeometry(1, 48, 48);
    const geometries: BufferGeometry[] = [unitSphere];
    const groups = blobs.map((blob) => {
      const group = new Group();
      const material = materials[blob.tone];
      let geometry: BufferGeometry = unitSphere;
      if (blob.shape === "torus") geometry = new TorusGeometry(1, 0.42, 48, 96);
      if (blob.shape === "knot") geometry = new TorusKnotGeometry(1, 0.38, 200, 32, 2, 3);
      if (geometry !== unitSphere) geometries.push(geometry);
      const mesh = new Mesh(geometry, material);
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
    let unit = 1;

    const draw = (seconds: number) => {
      const time = motionQuery.matches ? seconds : 0;
      groups.forEach((group, index) => {
        const blob = blobs[index];
        const depth = 1 + blob.z * 0.3;
        group.scale.setScalar(unit);
        group.rotation.x = blob.tilt[0] + time * blob.drift;
        group.rotation.y = blob.tilt[1] + time * blob.drift * 0.7;
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

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (motionQuery.matches && !document.hidden) frame = requestAnimationFrame(tick);
      else draw(0);
    };

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

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      applyColors();
      if (!frame) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 size-full" />;
}
