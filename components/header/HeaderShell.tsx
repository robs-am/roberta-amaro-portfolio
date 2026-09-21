"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const isHome = usePathname() === "/";

  // useLayoutEffect (not useEffect) so a locale switch's remount corrects `scrolled`
  // before paint, matching ThemeSync's fix for the same class of flicker.
  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page the header floats over the hero (no space of its own) so the hero can use
  // the full viewport; elsewhere it stays in the flow.
  return (
    <header
      className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-20 border-b transition-colors duration-300 ${
        scrolled && !isHome
          ? "border-border bg-background/95 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
