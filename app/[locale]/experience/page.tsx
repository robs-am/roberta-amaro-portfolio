import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { AwardHighlight } from "@/components/experience/AwardHighlight";
import { EducationTimeline } from "@/components/experience/EducationTimeline";
import { awards } from "@/data/awards";
import { education } from "@/data/education";
import { experiences } from "@/data/experiences";
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

  const t = await getTranslations({ locale, namespace: "ExperiencePage" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/experience"),
  };
}

export default async function ExperiencePage({ params }: PageProps<"/[locale]/experience">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Experience");
  const sorted = [...experiences].sort((a, b) => b.start.localeCompare(a.start));

  const tAwards = await getTranslations("Awards");
  const standaloneAwards = [...awards]
    .filter((award) => !award.experienceId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const sortedEducation = [...education].sort((a, b) => (b.end ?? "9999").localeCompare(a.end ?? "9999"));

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 pt-8 pb-16 sm:px-8 sm:pt-12 short:pt-6 short:pb-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>

      {/* Below lg: experience, awards, education in one column. From lg: awards in a sticky side column. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <ExperienceTimeline experiences={sorted} awards={awards} locale={locale} />
        </div>

        {standaloneAwards.length > 0 && (
          <aside
            aria-labelledby="awards-heading"
            className="mt-16 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-10 lg:self-start lg:sticky lg:top-24 short:mt-8"
          >
            <h2
              id="awards-heading"
              className="pb-4 text-sm font-medium tracking-wide text-muted uppercase"
            >
              {tAwards("title")}
            </h2>
            <AwardHighlight awards={standaloneAwards} locale={locale} />
          </aside>
        )}

        <section
          aria-labelledby="education-heading"
          className="mt-20 lg:col-start-1 lg:row-start-2 short:mt-8"
        >
          <h2
            id="education-heading"
            className="max-w-3xl border-b border-border pb-3 text-sm font-medium tracking-wide text-muted uppercase"
          >
            {t("educationTitle")}
          </h2>
          <EducationTimeline education={sortedEducation} locale={locale} />
        </section>
      </div>
    </main>
  );
}
