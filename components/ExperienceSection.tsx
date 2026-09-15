import { getTranslations } from "next-intl/server";
import { experiences } from "@/data/experiences";
import type { Locale } from "@/data/types";
import { ExperienceTimeline } from "./ExperienceTimeline";

export async function ExperienceSection({ locale }: Readonly<{ locale: Locale }>) {
  const t = await getTranslations("Experience");
  const sorted = [...experiences].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="snap-start h-[calc(100dvh-var(--header-height,0px))] overflow-y-auto scroll-mt-(--header-height,0px) border-t border-border py-16"
    >
      <h2 id="experience-title" data-reveal className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <ExperienceTimeline experiences={sorted} locale={locale} />
    </section>
  );
}
