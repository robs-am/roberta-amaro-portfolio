"use client";

import { useEffect, useRef } from "react";
import { LAYER_COUNT, createWaveScene } from "@/components/shapes/waveScene";
import { subscribeTheme } from "@/components/theme/theme";
import { pointerCurrent, pointerTarget, stepWaves, waveHorizon, waveSafe } from "@/components/shapes/shapesScene";

const POINTER_EASING = 0.05;
const FULL = Array.from({ length: LAYER_COUNT }, () => 1);

// The same scene as the hero's (see shapesScene.ts and waveScene.ts): same layers, colours and pointer
// offset, and the waves are drawn from the page's clock, so they carry on from where the hero left them.
// Decorative layer behind the menu items. Mount it only while the menu is visible: it owns a WebGL
// context and an animation loop, which are torn down on unmount.
export function MenuShapes({ active }: Readonly<{ active: boolean }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Read inside the loop instead of restarting the effect on every change: navigating away sets this
  // false mid-animation, and the loop should just stop scheduling itself on its very next frame,
  // freezing on whatever was last drawn (it's covered by the menu overlay either way).
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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

    const draw = (now: number) => {
      const { seconds, layers, warmth } = stepWaves(now);
      waves.setWarmth(warmth);
      waves.draw(motionQuery.matches ? seconds : 0, current.x, current.y, FULL, layers);
    };

    const tick = (time: number) => {
      if (!activeRef.current) {
        frame = 0;
        return;
      }
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
    waves.setSafeZone(waveSafe.u);
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

  // Same slight out-of-focus look as the hero's canvas (see HeroShapes.tsx), so the wave reads the same
  // way behind the big nav type as it does behind the hero's name, instead of switching to sharp focus.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 size-full scale-[1.03] blur-[1.5px]"
    />
  );
}
