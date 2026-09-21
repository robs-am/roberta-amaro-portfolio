import type { Metadata } from "next";
import type { Locale } from "@/data/types";
import { routing } from "./routing";

export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Open Graph uses underscored region codes ("pt_BR"), unlike the hreflang codes above. */
export const ogLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

/** Canonical URL plus hreflang alternates (with x-default) for one page. `path` is "" for the home. */
export function alternatesFor(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((option) => [htmlLang[option], `/${option}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}
