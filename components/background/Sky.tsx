"use client";

import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

// Light theme only: the sky before sunrise, a warm lavender at the top fading into the page's cream. It ties to the
// dark theme's violet. Behind the grain. Full strength on the home, where the waves are; on the inner pages it is a
// shorter, paler wash, so the colour does not outweigh the content (the same reason the dark glow was calmed there).
// Both washes stay mounted and cross-fade: a gradient cannot animate, so swapping one for the other would cut hard
// when the page changes.
const WASH =
  "pointer-events-none fixed inset-0 -z-8 transition-opacity duration-700 ease-in-out motion-reduce:transition-none dark:hidden";

export function Sky() {
  const pathname = usePathname();
  const isHome = routing.locales.some((locale) => pathname === `/${locale}`);

  return (
    <>
      <div
        aria-hidden="true"
        className={`${WASH} bg-[linear-gradient(to_bottom,var(--sky)_0%,color-mix(in_oklab,var(--sky)_50%,transparent)_40%,color-mix(in_oklab,var(--sky)_20%,transparent)_65%,transparent_90%)] ${
          isHome ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`${WASH} bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--sky)_45%,transparent)_0%,color-mix(in_oklab,var(--sky)_15%,transparent)_20%,transparent_40%)] ${
          isHome ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}
