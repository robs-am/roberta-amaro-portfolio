"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MathUtils } from "three";
import { LAYER_COUNT, createWaveScene } from "@/components/shapes/waveScene";
import { subscribeTheme } from "@/components/theme/theme";
import { HERO_ENTRANCE_MS, heroEntrance, pointerCurrent, pointerTarget } from "@/components/shapes/shapesScene";

const POINTER_EASING = 0.06;

const SCENE_OPACITY = 1;

// Entrance: each layer fades in, at the pace of the text (same duration), one after another from the top
// down, the last one landing when the text finishes (HERO_ENTRANCE_MS).
const FADE_MS = 1300;
const FADE_STARTS = [0, 500, 950, HERO_ENTRANCE_MS - FADE_MS];

// The scene fades out over the first stretch of scroll, as a fraction of the viewport height.
const FADE_DISTANCE = 0.45;

// Decorative and mouse-reactive only with a fine pointer and no reduced-motion preference; with
// reduced motion the scene is drawn once and never animated. Its opacity follows the scroll position
// directly (no timed transition), so it fades as fast as you scroll and never lags. The layer is portaled
// to <body> and fixed to the viewport: the hero clips its own overflow (and is translated, which would
// also re-anchor a fixed child), and this way the scene runs under the sticky header too. It sits
// just above the glow and the hero's bottom fade (both -z-10), so neither washes the waves out.
export function HeroShapes() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!layer || !canvas) return;

    const waves = createWaveScene(canvas);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    // Entrance: `faded` is 0..1 per layer (see FADE_STARTS). The delays are counted from when the hero's text
    // started, and the waves mount later (Three.js loads separately), so what has already passed is cut off.
    const faded = Array.from({ length: LAYER_COUNT }, () => ({ value: 0 }));
    const fades: JSAnimation[] = [];
    if (motionQuery.matches) {
      const elapsed = heroEntrance.startedAt ? performance.now() - heroEntrance.startedAt : 0;
      faded.forEach((item, index) => {
        const start = Math.max(FADE_STARTS[index] - elapsed, 0);
        const duration = Math.max(FADE_STARTS[index] + FADE_MS - elapsed - start, 300);
        fades.push(animate(item, { value: 1, duration, delay: start, ease: "inOutQuad" }));
      });
    } else {
      for (const item of faded) item.value = 1;
    }

    // The waves move on the page's own clock (performance.now), which the menu's scene reads too.
    const draw = (seconds: number) => {
      waves.draw(motionQuery.matches ? seconds : 0, current.x, current.y, faded.map((item) => item.value));
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

    // Smoothstep of the scroll position, so the fade eases in and out instead of tracking linearly.
    const fade = () => {
      const progress = MathUtils.clamp(window.scrollY / (window.innerHeight * FADE_DISTANCE), 0, 1);
      layer.style.opacity = String(SCENE_OPACITY * (1 - MathUtils.smoothstep(progress, 0, 1)));
      const wasVisible = visible;
      visible = progress < 1;
      if (visible !== wasVisible) sync();
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
      pointerTarget.x = target.x;
      pointerTarget.y = target.y;
    };

    waves.applyColors();
    resize();
    fade();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // The saved theme is applied after this effect, and the theme changes again on every toggle or
    // when the browser preference changes.
    const unsubscribeTheme = subscribeTheme(() => {
      waves.applyColors();
      if (!frame) draw(0);
    });

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", fade, { passive: true });
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      for (const item of fades) item.cancel();
      resizeObserver.disconnect();
      unsubscribeTheme();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", fade);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
      waves.dispose();
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
