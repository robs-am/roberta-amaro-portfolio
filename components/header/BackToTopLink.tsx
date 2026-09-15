"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { sectionHref } from "./sectionHref";
import { onSmoothAnchorClick } from "./smoothScroll";

export function BackToTopLink({ label }: { label: string }) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <a
      href={sectionHref(pathname, locale, "#hero")}
      aria-label={label}
      onClick={onSmoothAnchorClick}
      className="flex size-11 shrink-0 items-center justify-center rounded-sm text-foreground transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <ChevronsUpIcon />
    </a>
  );
}

// Tabler Icons (MIT).
function ChevronsUpIcon() {
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
      <path d="M7 11l5 -5l5 5" />
      <path d="M7 17l5 -5l5 5" />
    </svg>
  );
}
