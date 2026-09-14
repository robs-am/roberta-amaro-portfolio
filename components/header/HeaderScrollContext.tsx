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

export function useHeaderScrolled() {
  return useContext(HeaderScrollContext);
}
