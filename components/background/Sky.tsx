"use client";

import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

// Light theme only: the sky before sunrise, a warm lavender at the top fading into the page's cream. It ties to the
// dark theme's violet. Behind the grain. Full strength on the home, where the waves are; on the inner pages it is a
// shorter, paler wash, so the colour does not outweigh the content (the same reason the dark glow was calmed there).
export function Sky() {
  const pathname = usePathname();
  const isHome = routing.locales.some((locale) => pathname === `/${locale}`);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-8 dark:hidden ${
        isHome
          ? "bg-[linear-gradient(to_bottom,var(--sky)_0%,color-mix(in_oklab,var(--sky)_40%,transparent)_35%,transparent_65%)]"
          : "bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--sky)_45%,transparent)_0%,color-mix(in_oklab,var(--sky)_15%,transparent)_20%,transparent_40%)]"
      }`}
    />
  );
}
