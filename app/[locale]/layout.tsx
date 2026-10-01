import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BackgroundGlow } from "@/components/background/BackgroundGlow";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/background/Grain";
import { Header } from "@/components/header/Header";
import { ScrollReset } from "@/components/layout/ScrollReset";
import { ThemeSync } from "@/components/theme/ThemeSync";
import { themeInitScript } from "@/components/theme/theme";
import { profile } from "@/data/profile";
import { siteUrl } from "@/data/site";
import { alternatesFor, htmlLang, ogLocale } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";
import "../globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1ece9" },
    { media: "(prefers-color-scheme: dark)", color: "#15131a" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, ""),
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <html
      lang={htmlLang[locale]}
      className={`${jost.variable} ${plexSans.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("skipToContent")}
        </a>
        <ScrollReset />
        <ThemeSync />
        <BackgroundGlow />
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          {/* Light theme only: a pale warm lavender at the top, fading into the page's cream, the sky before sunrise
              (the cool blue read as an overcast day). It ties to the dark theme's violet. Behind the grain. */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-8 dark:hidden bg-[linear-gradient(to_bottom,var(--sky)_0%,color-mix(in_oklab,var(--sky)_40%,transparent)_35%,transparent_65%)]"
          />
          <Grain layerClassName="-z-6" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
