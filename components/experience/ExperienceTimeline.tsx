import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ExperienceEntrance } from "@/components/experience/ExperienceEntrance";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { localize, type Award, type Experience, type Locale } from "@/data/types";

function toDate(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

export async function ExperienceTimeline({
  experiences,
  awards = [],
  locale,
}: Readonly<{
  experiences: Experience[];
  /** Awards with an `experienceId` are shown inside the matching job. */
  awards?: Award[];
  locale: Locale;
}>) {
  const t = await getTranslations("Experience");
  const tAwards = await getTranslations("Awards");
  const format = await getFormatter();

  const formatMonth = (yearMonth: string) =>
    format.dateTime(toDate(yearMonth), { month: "short", year: "numeric" });

  return (
    <ExperienceEntrance className="mt-10 max-w-3xl space-y-14 short:mt-4 short:space-y-6">
      {experiences.map((item) => (
        <li key={item.id} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
          <div>
            <p
              data-experience-year
              className="w-fit font-display text-5xl leading-none font-bold tracking-wide text-accent"
            >
              {item.start.slice(0, 4)}
            </p>
            <p data-experience-body className="mt-3 text-sm text-muted">
              <time dateTime={item.start}>{formatMonth(item.start)}</time>
              {" – "}
              {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : t("present")}
            </p>
          </div>
          <div data-experience-body>
            <h2 className="text-lg font-semibold">{localize(item.role, locale)}</h2>
            <p className="text-sm font-medium text-accent">{item.company}</p>
            <p className="mt-3 leading-7 lg:text-xl lg:leading-9">{localize(item.description, locale)}</p>
            {awards.some((award) => award.experienceId === item.id) && (
              <div className="mt-5">
                <h3 className="text-sm font-medium tracking-wide text-muted uppercase">
                  {tAwards("title")}
                </h3>
                <ul className="mt-2 space-y-2">
                  {awards
                    .filter((award) => award.experienceId === item.id)
                    .map((award) => (
                      <li key={award.id} className="text-sm leading-6">
                        <span className="font-semibold">{localize(award.title, locale)}</span>
                        {", "}
                        {localize(award.event, locale)} ({formatMonth(award.date)})
                        {award.url && (
                          <a
                            href={award.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${tAwards("visit")} ${tAwards("newTab")}`}
                            className={`ml-3 ${textLinkClass}`}
                          >
                            <span className={textLinkLabelClass}>{tAwards("visit")}</span>
                            <ArrowIcon className={textLinkArrowClass} />
                          </a>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </li>
      ))}
    </ExperienceEntrance>
  );
}
