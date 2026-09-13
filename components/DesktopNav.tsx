"use client";

import { useEffect, useState } from "react";
import { navItems } from "./navItems";

export function DesktopNav({
  navLabel,
  labels,
}: {
  navLabel: string;
  labels: Record<(typeof navItems)[number]["key"], string>;
}) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label={navLabel} className="hidden md:block">
      <ul className="flex gap-2 text-base font-medium">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={activeHref === item.href ? "true" : undefined}
              className={`rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeHref === item.href
                  ? "bg-accent/10 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {labels[item.key]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
