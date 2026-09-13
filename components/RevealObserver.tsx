"use client";

import { useEffect } from "react";

function toMilliseconds(value: string) {
  const trimmed = value.trim();
  if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed);
  if (trimmed.endsWith("s")) return Number.parseFloat(trimmed) * 1000;
  return 0;
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

    // Let the hero entrance take focus before revealing what is already on screen.
    const hold = document.querySelector(".hero-reveal")
      ? toMilliseconds(getComputedStyle(document.documentElement).getPropertyValue("--reveal-hold"))
      : 0;
    const timer = window.setTimeout(observeAll, hold);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
