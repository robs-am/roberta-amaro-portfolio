"use client";

import { animate, cubicBezier, set, stagger } from "animejs";
import { useLayoutEffect } from "react";
import { heroNavigation } from "@/components/header/menu/menuEvents";

// Renders nothing: when the page was opened from one of the hero's links, it enters. The page's blocks marked
// `data-page-enter` rise and fade in one after another (the pace of the experience list's own entrance); a page with
// none marked fades its whole <main> instead. Any other way of arriving (the menu, a direct visit) leaves the
// page alone, since the menu has its own transition.
export function PageEnter() {
  useLayoutEffect(() => {
    if (!heroNavigation.pending) return;
    heroNavigation.pending = false;
    const main = document.getElementById("main-content");
    if (!main || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const blocks = [...main.querySelectorAll<HTMLElement>("[data-page-enter]")];
    const staged = blocks.length > 0;
    const targets = staged ? blocks : [main];

    // Before the first paint, so the page never shows at full strength for a frame.
    set(targets, { opacity: 0, translateY: staged ? 18 : 14 });
    const animation = animate(targets, {
      opacity: [0, 1],
      translateY: [staged ? 18 : 14, 0],
      duration: staged ? 900 : 450,
      delay: staged ? stagger(70, { start: 120 }) : 0,
      ease: staged ? "outExpo" : cubicBezier(0.2, 0, 0, 1),
    });
    return () => {
      animation.cancel();
      for (const target of targets) {
        target.style.opacity = "";
        target.style.transform = "";
      }
    };
  }, []);

  return null;
}
