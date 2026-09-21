import type { MetadataRoute } from "next";
import { isSitePublished, siteUrl } from "@/data/site";

// Until the real domain is configured, keep crawlers out so preview builds are not indexed.
export default function robots(): MetadataRoute.Robots {
  if (!isSitePublished) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
