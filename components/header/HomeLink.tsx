"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { sectionHref } from "./sectionHref";
import { onSmoothAnchorClick } from "./smoothScroll";

export function HomeLink({ label }: { label: string }) {
  const pathname = usePathname();
  const locale = useLocale();

  // The home page is just the hero, with its own CTAs to the other pages — nothing to link back to from there.
  if (pathname === "/") return null;

  return (
    <a
      href={sectionHref(pathname, locale, "#hero")}
      aria-label={label}
      onClick={onSmoothAnchorClick}
      className="flex size-11 shrink-0 items-center justify-center rounded-sm text-foreground transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <HomeIcon />
    </a>
  );
}

// Tabler Icons (MIT).
function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}
