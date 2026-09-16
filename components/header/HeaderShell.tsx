"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HeaderScrollProvider } from "./HeaderScrollContext";
import { HeroVisibilityProvider } from "./HeroVisibilityContext";

export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  // Defaults to false (contact links shown) so pages without a hero — the all-projects page —
  // never need a synchronous correction; the observer below flips it true almost immediately
  // wherever a hero does exist.
  const [heroVisible, setHeroVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // useLayoutEffect (not useEffect) so a locale switch's remount corrects `scrolled`
  // before paint, matching ThemeClassSync's fix for the same class of flicker.
  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.querySelector("#hero");
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    // Exposed so #hero can offset its scroll-margin-top and land at scrollY 0 (header height varies by breakpoint).
    const setHeight = () =>
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-20 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/95 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <HeaderScrollProvider scrolled={scrolled}>
        <HeroVisibilityProvider visible={heroVisible}>{children}</HeroVisibilityProvider>
      </HeaderScrollProvider>
    </header>
  );
}
