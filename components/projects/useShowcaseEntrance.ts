import { animate, type JSAnimation } from "animejs";
import { useEffect, type RefObject } from "react";

// Same entrance as the experience list: each row enters once, when it scrolls into view. Its
// title is wiped in from the left, then its category fades up. CSS hides them only until this
// runs (see `[data-showcase]` in globals.css), with a fallback that shows them anyway. Reduced
// motion never hides them, so there is nothing to do.
export function useShowcaseEntrance(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const targets = root.querySelectorAll<HTMLElement>(
      "[data-showcase-title], [data-showcase-meta]",
    );
    for (const element of targets) element.style.opacity = "0";
    root.dataset.ready = "";

    const animations: JSAnimation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);

          const headings = entry.target.querySelectorAll<HTMLElement>("[data-showcase-title]");
          const meta = entry.target.querySelectorAll<HTMLElement>("[data-showcase-meta]");
          animations.push(
            animate(headings, {
              opacity: [0, 1],
              clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
              translateX: [-24, 0],
              duration: 1200,
              ease: "outExpo",
            }),
            animate(meta, {
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
    for (const item of root.querySelectorAll("[data-showcase-item]")) observer.observe(item);

    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, [rootRef]);
}
