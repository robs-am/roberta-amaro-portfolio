import type { Locale } from "@/data/types";

/**
 * `anchorHref` is a same-page hash like "#experience". On the home route
 * (pathname "/") it stays a bare hash so `onSmoothAnchorClick` animates the
 * scroll; anywhere else it becomes a full path so the link navigates back
 * to the home page and lands on that section.
 */
export function sectionHref(pathname: string, locale: Locale, anchorHref: string) {
  return pathname === "/" ? anchorHref : `/${locale}${anchorHref}`;
}
