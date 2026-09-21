import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/data/site";
import { alternatesFor } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternatesFor(locale, path).languages ?? {}).map(([lang, href]) => [
            lang,
            `${siteUrl}${href}`,
          ]),
        ),
      },
    })),
  );
}
