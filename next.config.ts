import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory makes Turbopack guess the wrong root.
  turbopack: {
    root: __dirname,
  },
  // Awards now live on the experience page; keep old links to /awards working.
  async redirects() {
    return [
      {
        source: "/:locale(pt|en)/awards",
        destination: "/:locale/experience",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
