"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

// The experience list. Each item enters once, when it scrolls into view: its year is wiped in from
// the left (the same gesture as the hero's first name), then its text fades up. CSS hides the year
// and text only until this runs (see `[data-experience-list]` in globals.css), with a fallback that
// shows them anyway. Reduced motion never hides them, so there is nothing to do.
export function ExperienceEntrance({
  className,
  children,
}: Readonly<{ className?: string; children: ReactNode }>) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const targets = list.querySelectorAll<HTMLElement>(
      "[data-experience-year], [data-experience-body]",
    );
    for (const target of targets) target.style.opacity = "0";
    list.dataset.ready = "";

    const animations: JSAnimation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);

          const year = entry.target.querySelector<HTMLElement>("[data-experience-year]");
          const body = entry.target.querySelectorAll<HTMLElement>("[data-experience-body]");
          if (year) {
            animations.push(
              animate(year, {
                opacity: [0, 1],
                clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
                translateX: [-24, 0],
                duration: 1200,
                ease: "outExpo",
              }),
            );
          }
          animations.push(
            animate(body, {
              opacity: [0, 1],
              translateY: [16, 0],
              duration: 900,
              delay: 400,
              ease: "outExpo",
            }),
          );
        }
      },
      { threshold: 0.3 },
    );
    for (const item of list.children) observer.observe(item);

    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, []);

  return (
    <ol ref={listRef} data-experience-list className={className}>
      {children}
    </ol>
  );
}
