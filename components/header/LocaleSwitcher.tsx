"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { currentSectionHash } from "./currentSection";

export function LocaleSwitcher() {
  const t = useTranslations("Header.language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    for (const option of routing.locales) {
      if (option !== locale) router.prefetch(pathname, { locale: option });
    }
  }, [locale, pathname, router]);

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex rounded-md border border-border p-0.5 text-xs font-semibold"
    >
      {routing.locales.map((option) => {
        const active = option === locale;

        return (
          <button
            key={option}
            type="button"
            aria-label={t(option)}
            aria-pressed={active}
            onClick={() => {
              if (active) return;
              // Always go to top when changing locale — avoids scroll fighting between router and manual scroll.
              window.scrollTo(0, 0);
              router.replace(pathname, { locale: option, scroll: false });
            }}
            className={`cursor-pointer rounded px-2 py-1.5 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
