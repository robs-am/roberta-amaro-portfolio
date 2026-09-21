"use client";

import { useLayoutEffect } from "react";
import { applyStoredTheme } from "@/components/theme";

// A locale switch remounts <html>, which drops the `data-theme` the visitor's pick put there; restore
// it before paint so the page never shows the other theme for a frame.
export function ThemeSync() {
  useLayoutEffect(() => {
    applyStoredTheme();
  }, []);

  return null;
}
