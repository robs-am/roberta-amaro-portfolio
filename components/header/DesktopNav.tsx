"use client";

import { useEffect, useState } from "react";
import { useHeaderScrolled } from "./HeaderScrollContext";
import { navItems } from "./navItems";
import { onSmoothAnchorClick } from "./smoothScroll";

export function DesktopNav({
  navLabel,
  labels,
}: Readonly<{
  navLabel: string;
  labels: Record<(typeof navItems)[number]["key"], string>;
}>) {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const scrolled = useHeaderScrolled();

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

  const inactiveClass = scrolled ? "text-muted hover:text-foreground" : "text-foreground/90 hover:text-foreground";

  return (
    <nav aria-label={navLabel} className="hidden md:block">
      <ul className="flex gap-2 text-base font-medium">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={onSmoothAnchorClick}
              aria-current={activeHref === item.href ? "true" : undefined}
              className={`rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeHref === item.href ? "bg-accent/10 text-foreground" : inactiveClass
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
