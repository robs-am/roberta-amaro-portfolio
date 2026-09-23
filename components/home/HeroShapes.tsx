"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MathUtils } from "three";
import { LAYER_COUNT, PORTRAIT_ASPECT, createWaveScene } from "@/components/shapes/waveScene";
import { installWaveMoodConsole } from "@/components/shapes/mockWaveMood";
import { subscribeTheme } from "@/components/theme/theme";
import {
  HERO_ENTRANCE_MS,
  heroEntrance,
  pointerCurrent,
  pointerTarget,
  stepWaves,
  waveHorizon,
  waveSafe,
} from "@/components/shapes/shapesScene";

const POINTER_EASING = 0.06;
// Pixels between the bottom of the name and the horizon, and how far the horizon is then raised (in screen
// height units). The two waves of a layer rarely peak together, so its real highest crest sits well below
// the horizon; the lift makes the crests reach up close to the name without touching it.
const NAME_GAP = 10;
const HORIZON_LIFT = 0.06;
// Pixels of clear space kept to the right of the text before the waves start to come in.
const SAFE_MARGIN = 24;
// On a portrait phone there is no horizontal safe zone (the text fills the width), so the waves have to
// clear the content vertically instead: the horizon is measured from the bottom of the CTAs, not the name,
// with this much extra clearance so the nearest crest does not just graze them.
const PORTRAIT_CLEAR = 28;

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

    // The waves move on a clock and a mood shared with the menu's scene (see `stepWaves`), fed by the page's own
    // clock (performance.now), so the menu picks them up exactly where the hero left them.
    const draw = (now: number) => {
      const { seconds, layers } = stepWaves(now);
      waves.draw(motionQuery.matches ? seconds : 0, current.x, current.y, faded.map((item) => item.value), layers);
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

    // The waves start just under the name, so it stands clear above them; on a portrait phone, where the
    // waves can't dodge sideways, they start under the CTAs instead, clearing the name, role and CTAs
    // together. Either reference's place comes from the layout (offsetTop), which the entrance animation
    // does not move, so this can run at any time.
    const placeHorizon = (height: number, portrait: boolean) => {
      const target = portrait
        ? (document.querySelector<HTMLElement>("#hero [data-hero-cta]") ?? document.querySelector<HTMLElement>("#hero h1"))
        : document.querySelector<HTMLElement>("#hero h1");
      if (!target) return;
      let bottom = target.offsetHeight;
      for (let node: HTMLElement | null = target; node; node = node.offsetParent as HTMLElement | null) bottom += node.offsetTop;
      const gap = NAME_GAP + (portrait ? PORTRAIT_CLEAR : 0);
      waveHorizon.y = MathUtils.clamp(1 - (2 * (bottom + gap)) / height + HORIZON_LIFT, -0.6, 0.4);
      waves.setHorizon(waveHorizon.y);
    };

    // The right edge of the text on the home, in viewport pixels. The name's words slide in sideways, so they
    // are measured from the layout (offsetLeft), which the slide does not move; the other lines only rise, so
    // their boxes can be read as they are. Lines and icons hidden at this width (the phone's credits) have
    // no boxes and do not count.
    const textRight = () => {
      const hero = document.getElementById("hero");
      if (!hero) return 0;
      let right = 0;
      for (const word of hero.querySelectorAll<HTMLElement>("[data-hero-word]")) {
        let edge = word.offsetWidth;
        for (let node: HTMLElement | null = word; node; node = node.offsetParent as HTMLElement | null) edge += node.offsetLeft;
        right = Math.max(right, edge);
      }
      const range = document.createRange();
      for (const item of hero.querySelectorAll("[data-hero-item]")) {
        range.selectNodeContents(item);
        for (const rect of range.getClientRects()) right = Math.max(right, rect.right);
      }
      return right;
    };

    const placeSafeZone = (width: number) => {
      const right = textRight();
      if (!right) return;
      waveSafe.u = MathUtils.clamp((2 * (right + SAFE_MARGIN)) / width - 1, -0.9, 0.9);
      waves.setSafeZone(waveSafe.u);
    };

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      waves.resize(width, height);
      placeHorizon(height, width / height < PORTRAIT_ASPECT);
      placeSafeZone(width);
      sync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches || !motionQuery.matches) return;
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerTarget.x = target.x;
      pointerTarget.y = target.y;
    };

    installWaveMoodConsole();
    waves.applyColors();
    resize();
    fade();
    // The name's size changes once the fonts load, so place the horizon again.
    void document.fonts?.ready.then(resize);

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
      {/* A slight blur puts the waves out of focus, so the sharp text reads as being in front of them. The
          scale hides the edges, where the blur would otherwise fade into the page. */}
      <canvas ref={canvasRef} className="size-full scale-[1.03] blur-[1.5px]" />
      {/* Dark mode only: the empty sky above the waves is flat `--background`, so where the wave's paper-cut
          edge begins reads as a hard stain against it. A soft radial wash of the page's own glow, anchored
          low and to the right, fades that area out gradually — no straight edge anywhere. Same values as the
          menu's (see Menu.tsx), and in this same fixed-to-viewport layer (not the hero section, which is
          shorter and translated by its entrance animation) so both line up and fade together with the canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(ellipse_135%_100%_at_80%_82%,color-mix(in_oklab,var(--glow-1)_50%,transparent)_0%,transparent_82%)]"
      />
    </div>,
    document.body,
  );
}
