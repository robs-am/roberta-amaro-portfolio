"use client";

import { useEffect } from "react";

function toMilliseconds(value: string) {
  const trimmed = value.trim();
  if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed);
  if (trimmed.endsWith("s")) return Number.parseFloat(trimmed) * 1000;
  return 0;
}

function heroAnimationTime(hero: Element | null) {
  const time = hero?.firstElementChild?.getAnimations()[0]?.currentTime;
  return typeof time === "number" ? time : null;
}

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Stagger only the elements that enter the viewport together.
        let batchIndex = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.style.setProperty("--reveal-index", String(batchIndex++));
          element.dataset.revealed = "";
          observer.unobserve(element);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    const observeAll = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((element) => observer.observe(element));

    // Let the hero entrance take focus first. The hold counts from when the hero animation started
    // (first paint), not from hydration, which can take seconds on slow devices or in dev.
    const hero = document.querySelector(".hero-reveal");
    const elapsed = heroAnimationTime(hero);
    const hold = hero
      ? toMilliseconds(getComputedStyle(document.documentElement).getPropertyValue("--reveal-hold"))
      : 0;
    const remaining = elapsed === null ? 0 : Math.max(0, hold - elapsed);
    const timer = window.setTimeout(observeAll, remaining);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
