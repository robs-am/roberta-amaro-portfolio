"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";

const DURATION = 700;

// The line that runs down the timeline. It grows to the dot of the last card the RevealObserver has
// revealed, so it follows the cards regardless of which container scrolls. CSS hides it only when
// this can run (see `[data-timeline-line]` in globals.css), with a fallback that shows it anyway.
export function TimelineLine() {
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const list = line?.parentElement;
    if (!line || !list) return;

    // No hiding in CSS for reduced motion, so the line is already fully drawn.
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    line.style.transform = "scaleY(0)";
    line.dataset.ready = "";

    let animation: JSAnimation | undefined;

    const sync = () => {
      const items = list.querySelectorAll<HTMLElement>("li[data-revealed]");
      const last = items[items.length - 1];
      let progress = 0;
      if (last) {
        progress =
          last === list.lastElementChild
            ? 1
            : (last.offsetTop + last.offsetHeight / 2) / list.offsetHeight;
      }

      animation?.cancel();
      animation = animate(line, { scaleY: progress, duration: DURATION, ease: "outQuad" });
    };

    const observer = new MutationObserver(sync);
    observer.observe(list, { subtree: true, attributes: true, attributeFilter: ["data-revealed"] });
    sync();

    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, []);

  return (
    <span
      ref={lineRef}
      aria-hidden="true"
      data-timeline-line
      className="absolute inset-y-0 -left-px w-px origin-top bg-accent/70 sm:bg-accent/30"
    />
  );
}
