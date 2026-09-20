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
import {
  PORTRAIT_ASPECT,
  POINTER_SHIFT,
  SHAPE_OPACITY,
  UNIT_SHARE,
  blobs,
  pointerCurrent,
  pointerTarget,
} from "@/components/shapesScene";

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_Z = 30;
const CAMERA_FOV = 12;
const POINTER_EASING = 0.05;

// The same scene as the hero's (see shapesScene.ts): same shapes, places, sizes, material and pointer
// offset, so opening the menu over the home does not make the shapes jump. The menu only needs
// atmosphere behind the big type, so there is no morphing and no per-frame geometry.
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
    const materials = createShapeMaterials(SHAPE_OPACITY);

    const unitSphere = new SphereGeometry(1, 48, 48);
    const geometries: BufferGeometry[] = [unitSphere];
    const meshes: Mesh[] = [];
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
      meshes.push(mesh);
      scene.add(group);
      return group;
    });
    const bases = blobs.map(() => new Vector3());

    const applyColors = () => applyShapeColors(materials, lights);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    // Start from where the hero's pointer state was, so nothing jumps.
    const target = { ...pointerTarget };
    const current = { ...pointerCurrent };
    let frame = 0;
    let unit = 1;

    const draw = (seconds: number) => {
      const time = motionQuery.matches ? seconds : 0;
      groups.forEach((group, index) => {
        const blob = blobs[index];
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
      const portrait = camera.aspect < PORTRAIT_ASPECT;
      blobs.forEach((blob, index) => {
        const [x, y] = portrait ? blob.portrait.anchor : blob.anchor;
        bases[index].set(x * halfWidth, y * halfHeight, blob.z);
        meshes[index].scale.setScalar(portrait ? blob.portrait.radius : blob.radius);
      });
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
