import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { experiences } from "@/data/experiences";
import { Link } from "@/i18n/navigation";
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
  const tPage = await getTranslations("ExperiencePage");
  const sorted = [...experiences].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <Link
        href="/"
        className="inline-block rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← {tPage("back")}
      </Link>
      <h1 data-reveal className="mt-8 text-2xl font-semibold">
        {t("title")}
      </h1>
      <ExperienceTimeline experiences={sorted} locale={locale} />
    </main>
  );
}
