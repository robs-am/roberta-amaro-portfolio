"use client";

import { useLayoutEffect } from "react";

// A locale switch remounts this layout with the previous section's hash still in the
// address bar. Next's own hash-scroll conflicts with `scroll-snap-type: mandatory` +
// `scroll-behavior: smooth` on <html> (see smoothScroll.ts's identical fight), landing
// on the wrong section or dipping the scroll position — so LocaleSwitcher disables it
// (`scroll: false`) and this restores the position ourselves, before paint, with
// snap/smooth suspended the same way smoothScroll.ts does for its animated scroll.
export function SectionScrollSync() {
  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!(target instanceof HTMLElement)) return;

    const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - scrollMarginTop;

    const html = document.documentElement;
    const previousSnapType = html.style.scrollSnapType;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollSnapType = "none";
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, targetY);
    html.style.scrollSnapType = previousSnapType;
    html.style.scrollBehavior = previousScrollBehavior;
  }, []);

  return null;
}
