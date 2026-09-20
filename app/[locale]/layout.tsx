import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header/Header";
import { ScrollReset } from "@/components/ScrollReset";
import { SectionScrollSync } from "@/components/SectionScrollSync";
import { ThemeClassSync } from "@/components/ThemeClassSync";
import type { Locale } from "@/data/types";
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

const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f6" },
    { media: "(prefers-color-scheme: dark)", color: "#181216" },
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
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((option) => [htmlLang[option], `/${option}`]),
      ),
    },
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
      className={`${jost.variable} ${plexSans.variable} snap-y snap-mandatory antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-hidden bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("skipToContent")}
        </a>
        <ScrollReset />
        <ThemeClassSync />
        <SectionScrollSync />
        <BackgroundGlow />
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
