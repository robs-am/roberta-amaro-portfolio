"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HeaderScrollProvider } from "./HeaderScrollContext";

export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          ? "border-border bg-background/85 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <HeaderScrollProvider scrolled={scrolled}>{children}</HeaderScrollProvider>
    </header>
  );
}
