import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AwardList } from "@/components/AwardList";
import { awards } from "@/data/awards";
import { siteUrl } from "@/data/site";
import { alternatesFor } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "AwardsPage" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/awards"),
  };
}

export default async function AwardsPage({ params }: PageProps<"/[locale]/awards">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Awards");
  const sorted = [...awards].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <AwardList awards={sorted} locale={locale} />
    </main>
  );
}
