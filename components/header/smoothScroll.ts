import type { MouseEvent } from "react";

const DURATION = 650;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return;

  const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - scrollMarginTop;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    window.scrollTo(0, targetY);
    history.pushState(null, "", hash);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  // `scroll-snap-type: mandatory` and `scroll-behavior: smooth` (both needed so wheel/trackpad
  // scrolling snaps smoothly between sections) fight a JS-driven scroll: the browser tries to
  // snap to and smooth-animate toward the nearest section on every intermediate `scrollTo` call,
  // short-circuiting our own easing. Suspend both for the trip, then restore them.
  const html = document.documentElement;
  const previousSnapType = html.style.scrollSnapType;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollSnapType = "none";
  html.style.scrollBehavior = "auto";

  function step(now: number) {
    const progress = Math.min((now - startTime) / DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      html.style.scrollSnapType = previousSnapType;
      html.style.scrollBehavior = previousScrollBehavior;
      history.pushState(null, "", hash);
    }
  }

  requestAnimationFrame(step);
}

// Attach to onClick on any same-page `<a href="#...">`. Leaves modified clicks (new tab, etc.) to the browser.
export function onSmoothAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  scrollToHash(href);
}
