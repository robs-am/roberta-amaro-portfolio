"use client";

import { createContext, useContext, type ReactNode } from "react";

const HeroVisibilityContext = createContext(false);

export function HeroVisibilityProvider({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return <HeroVisibilityContext.Provider value={visible}>{children}</HeroVisibilityContext.Provider>;
}

// Defaults to false (contact links shown) — see the matching comment in HeaderShell.tsx.
export function useHeroVisible() {
  return useContext(HeroVisibilityContext);
}
