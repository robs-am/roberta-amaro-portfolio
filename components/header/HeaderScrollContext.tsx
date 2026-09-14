"use client";

import { createContext, useContext, type ReactNode } from "react";

const HeaderScrollContext = createContext(false);

export function HeaderScrollProvider({
  scrolled,
  children,
}: {
  scrolled: boolean;
  children: ReactNode;
}) {
  return <HeaderScrollContext.Provider value={scrolled}>{children}</HeaderScrollContext.Provider>;
}

// Header text over the transparent (unscrolled) header sits directly on the glow, so it needs
// the same AA-safe treatment as the hero: foreground instead of muted/accent until scrolled.
export function useHeaderScrolled() {
  return useContext(HeaderScrollContext);
}
