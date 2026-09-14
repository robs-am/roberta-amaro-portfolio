"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ProjectsCarousel({
  children,
  dotLabels,
}: {
  children: ReactNode;
  dotLabels: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.children);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = cards.indexOf(entry.target);
          if (index !== -1) setActive(index);
        }
      },
      { root: container, threshold: 0.6 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index: number) => {
    const card = containerRef.current?.children[index];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {dotLabels.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {dotLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-current={active === index}
              onClick={() => scrollToCard(index)}
              className={`size-2 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active === index ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
