import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { experiences } from "@/data/experiences";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "ExperiencePage" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/experience`,
      languages: Object.fromEntries(
        routing.locales.map((option) => [option, `/${option}/experience`]),
      ),
    },
  };
}

export default async function ExperiencePage({ params }: PageProps<"/[locale]/experience">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Experience");
  const sorted = [...experiences].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <ExperienceTimeline experiences={sorted} locale={locale} />
    </main>
  );
}
