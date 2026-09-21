"use client";

import { animate, type JSAnimation } from "animejs";
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
  WebGLRenderer,
} from "three";
import { createHoverSpin } from "@/components/hoverSpin";
import { applyShapeColors, createShapeLights, createShapeMaterials } from "@/components/shapeStyle";
import {
  PLACEMENT_MS,
  PORTRAIT_ASPECT,
  POINTER_SHIFT,
  SHAPE_OPACITY,
  UNIT_SHARE,
  blobs,
  collectTextRects,
  fitPlacements,
  heroPlacements,
  pointerCurrent,
  pointerTarget,
  type Placement,
} from "@/components/shapesScene";

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_Z = 30;
const CAMERA_FOV = 12;
const POINTER_EASING = 0.05;

// The same scene as the hero's (see shapesScene.ts): same shapes, sizes, material and pointer offset.
// On a portrait screen the shapes fit themselves around the text, which differs between the home and
// the menu, so they start from where the hero left them and glide to the menu's places when it opens
// (and back when it closes). The menu only needs atmosphere behind the big type, so there is no
// morphing and no per-frame geometry.
// Decorative layer behind the menu items. Mount it only while the menu is visible: it owns a WebGL
// context and an animation loop, which are torn down on unmount.
export function MenuShapes({ open }: Readonly<{ open: boolean }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openRef = useRef(open);
  const retargetRef = useRef<() => void>(undefined);

  // While the menu is open the shapes go to the menu's places; once it starts closing, back to the hero's.
  useEffect(() => {
    openRef.current = open;
    retargetRef.current?.();
  }, [open]);

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

    const applyColors = () => applyShapeColors(materials, lights);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const spin = createHoverSpin(meshes, camera);
    // Start from where the hero's pointer state was, so nothing jumps.
    const target = { ...pointerTarget };
    const current = { ...pointerCurrent };
    let frame = 0;
    let unit = 1;
    let halfWidth = 1;
    let halfHeight = 1;
    // `menuTargets` are the menu's own places; `displayed` is what is drawn, gliding between them and the hero's.
    const menuTargets: Placement[] = blobs.map((blob) => ({ x: blob.anchor[0], y: blob.anchor[1], radius: blob.radius }));
    const displayed: Placement[] = (heroPlacements.current ?? menuTargets).map((place) => ({ ...place }));
    let glides: JSAnimation[] = [];

    const retarget = () => {
      for (const glide of glides) glide.cancel();
      const goal = openRef.current ? menuTargets : (heroPlacements.current ?? menuTargets);
      if (!motionQuery.matches) {
        displayed.forEach((place, index) => Object.assign(place, goal[index]));
        glides = [];
        if (!frame) draw(0);
        return;
      }
      glides = displayed.map((place, index) =>
        animate(place, { ...goal[index], duration: PLACEMENT_MS, ease: "outExpo" }),
      );
    };
    retargetRef.current = retarget;

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
        const place = displayed[index];
        meshes[index].scale.setScalar(place.radius);
        meshes[index].rotation.z = spin.angles[index];
        group.position.set(
          place.x * halfWidth - current.x * POINTER_SHIFT * depth,
          place.y * halfHeight - current.y * POINTER_SHIFT * depth + Math.sin(time * 0.5 + index * 1.7) * 0.06,
          blob.z,
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
      halfHeight = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2)) * CAMERA_Z;
      halfWidth = halfHeight * camera.aspect;
      unit = Math.min(halfHeight, halfWidth * 0.7) * UNIT_SHARE;
      const textColumn = canvas.parentElement?.querySelector(".menu-body");
      const fitted: Placement[] =
        camera.aspect < PORTRAIT_ASPECT && textColumn
          ? fitPlacements(collectTextRects(textColumn), width, height, unit * (height / (2 * halfHeight)))
          : blobs.map((blob) => ({ x: blob.anchor[0], y: blob.anchor[1], radius: blob.radius }));
      fitted.forEach((place, index) => Object.assign(menuTargets[index], place));
      retarget();
      sync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      spin.hover(event.clientX, event.clientY);
    };

    applyColors();
    resize();
    // The items slide in while the menu opens, so measure again once they have settled.
    const settled = window.setTimeout(resize, 1200);

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
      window.clearTimeout(settled);
      for (const glide of glides) glide.cancel();
      retargetRef.current = undefined;
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      spin.dispose();
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 size-full" />;
}
