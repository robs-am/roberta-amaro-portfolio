"use client";

import { useEffect, useRef } from "react";
import { LAYER_COUNT, createWaveScene } from "@/components/shapes/waveScene";
import { subscribeTheme } from "@/components/theme/theme";
import { pointerCurrent, pointerTarget, waveHorizon } from "@/components/shapes/shapesScene";

const POINTER_EASING = 0.05;
const FULL = Array.from({ length: LAYER_COUNT }, () => 1);

// The same scene as the hero's (see shapesScene.ts and waveScene.ts): same layers, colours and pointer
// offset, and the waves are drawn from the page's clock, so they carry on from where the hero left them.
// Decorative layer behind the menu items. Mount it only while the menu is visible: it owns a WebGL
// context and an animation loop, which are torn down on unmount.
export function MenuShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const waves = createWaveScene(canvas);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    // Start from where the hero's pointer state was, so nothing jumps.
    const target = { ...pointerTarget };
    const current = { ...pointerCurrent };
    let frame = 0;

    const draw = (seconds: number) => {
      waves.draw(motionQuery.matches ? seconds : 0, current.x, current.y, FULL);
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
      waves.resize(width, height);
      sync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    waves.applyColors();
    waves.setHorizon(waveHorizon.y);
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const unsubscribeTheme = subscribeTheme(() => {
      waves.applyColors();
      if (!frame) draw(0);
    });

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      unsubscribeTheme();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      waves.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 size-full" />;
}
