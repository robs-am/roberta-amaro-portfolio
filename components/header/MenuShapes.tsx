"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferGeometry,
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

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_Z = 30;
const CAMERA_FOV = 12;
const POINTER_EASING = 0.05;
const POINTER_SHIFT = 0.4;
const UNIT_SHARE = 0.3;

type Point = [number, number, number];

// Same family as the hero blobs (glossy tubes and spheres bleeding off the edges), but static shapes:
// the menu only needs atmosphere behind the big type, so no morphing and no per-frame geometry.
// `anchor` is the center in normalized viewport coordinates (-1..1, y up); `radius` is in blob units.
type Blob = {
  anchor: [number, number];
  z: number;
  radius: number;
  path?: Point[];
  tilt: number;
  drift: number;
  tone: 0 | 1;
};

const blobs: Blob[] = [
  {
    anchor: [0.8, 0.6], z: 0, radius: 0.45, tilt: -0.3, drift: 0.05, tone: 0,
    path: [[-1.2, 0.5, 0], [-0.3, 0.8, 0.2], [0.5, 0.2, 0], [1, -0.6, 0.1]],
  },
  { anchor: [-0.9, 0.9], z: -1, radius: 0.75, tilt: 0, drift: 0.03, tone: 1 },
  {
    anchor: [-0.75, -0.8], z: 0.4, radius: 0.5, tilt: 0.2, drift: -0.04, tone: 1,
    path: [[-1, 0.2, 0], [-0.3, 0.7, 0.1], [0.6, 0.3, 0], [1.1, -0.6, 0.1]],
  },
  { anchor: [0.9, -0.85], z: 0.2, radius: 0.55, tilt: 0, drift: 0.04, tone: 0 },
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

    const unitSphere = new SphereGeometry(1, 48, 48);
    const geometries: BufferGeometry[] = [unitSphere];
    const groups = blobs.map((blob) => {
      const group = new Group();
      const material = materials[blob.tone];
      if (blob.path) {
        const curve = new CatmullRomCurve3(blob.path.map(([x, y, z]) => new Vector3(x, y, z)));
        const tube = new TubeGeometry(curve, 120, blob.radius, 32, false);
        geometries.push(tube);
        group.add(new Mesh(tube, material));
        // Spheres of the tube's radius round off its two open ends.
        for (const point of [curve.getPointAt(0), curve.getPointAt(1)]) {
          const cap = new Mesh(unitSphere, material);
          cap.position.copy(point);
          cap.scale.setScalar(blob.radius);
          group.add(cap);
        }
      } else {
        const sphere = new Mesh(unitSphere, material);
        sphere.scale.setScalar(blob.radius);
        group.add(sphere);
      }
      scene.add(group);
      return group;
    });
    const bases = blobs.map(() => new Vector3());

    const applyColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const token = (name: string) => new Color(styles.getPropertyValue(name).trim());
      const dark = document.documentElement.classList.contains("dark");
      materials[0].color = token(dark ? "--elevated" : "--card");
      materials[1].color = token(dark ? "--card" : "--glow-1");
      materials.forEach((material) => material.sheenColor.copy(material.color).lerp(new Color(0xffffff), dark ? 0.15 : 0.5));
      key.color = token(dark ? "--highlight" : "--card");
      rim.color = token("--glow-2");
      ambient.intensity = dark ? 0.5 : 1.6;
      key.intensity = dark ? 2.5 : 1.6;
      rim.intensity = dark ? 1.5 : 0.8;
    };

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
        group.rotation.z = blob.tilt + time * blob.drift;
        group.rotation.x = Math.sin(time * 0.2 + index) * 0.15;
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
