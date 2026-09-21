"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { getTheme, setTheme, subscribeTheme } from "@/components/theme";

export function ThemeToggle() {
  const t = useTranslations("Header.theme");
  // The theme depends on the visitor's browser, so it is unknown on the server: the button renders
  // only after hydration, with a placeholder of the same size before that.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);

  if (!theme) {
    return <span className="size-9" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("startViewTransition" in document) || reduceMotion) {
      setTheme(nextTheme);
      return;
    }

    // The view transition cross-fades the whole page instead of flashing between the two themes.
    document.startViewTransition(() => setTheme(nextTheme));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("toLight") : t("toDark")}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
