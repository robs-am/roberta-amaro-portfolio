/**
 * Public origin of the site, used for canonical URLs, the sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL in production; without it the site is treated as not yet published
 * (see app/robots.ts).
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const isSitePublished = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

/** Routes that have their own page, without the locale prefix. "" is the home. */
export const routes = ["", "/about", "/experience", "/projects", "/awards"] as const;
