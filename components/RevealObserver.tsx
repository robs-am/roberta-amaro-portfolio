"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export function RevealObserver() {
  const pathname = usePathname();

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

    document
      .querySelectorAll("[data-reveal]:not([data-revealed])")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
