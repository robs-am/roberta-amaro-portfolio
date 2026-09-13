"use client";

import { useLayoutEffect } from "react";

// A locale switch remounts <html>, which drops next-themes' class until its passive effect runs; restore it before paint.
// Keep in sync with next-themes: storageKey "theme" and "system" resolution.
export function ThemeClassSync() {
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {}

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = !stored || stored === "system" ? (prefersDark ? "dark" : "light") : stored;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, []);

  return null;
}
