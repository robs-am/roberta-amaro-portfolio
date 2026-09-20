import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ExperienceEntrance } from "@/components/ExperienceEntrance";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/textLinkStyles";
import { localize, type Award, type Locale } from "@/data/types";

export async function AwardList({
  awards,
  locale,
}: Readonly<{
  awards: Award[];
  locale: Locale;
}>) {
  const t = await getTranslations("Awards");
  const format = await getFormatter();

  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    return format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
      month: "short",
      year: "numeric",
    });
  };

  // Reuses the experience entrance: the year wipes in, then the text fades up.
  return (
    <ExperienceEntrance className="mt-10 max-w-3xl space-y-14">
      {awards.map((item) => (
        <li key={item.id} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
          <div>
            <p
              data-experience-year
              className="w-fit font-display text-5xl leading-none font-bold tracking-wide text-accent"
            >
              {item.date.slice(0, 4)}
            </p>
            <p data-experience-body className="mt-3 text-sm text-muted">
              <time dateTime={item.date}>{formatMonth(item.date)}</time>
            </p>
          </div>
          <div data-experience-body>
            <h3 className="text-lg font-semibold">{localize(item.title, locale)}</h3>
            <p className="text-sm font-medium text-accent">{localize(item.event, locale)}</p>
            <p className="mt-1 text-sm text-muted">
              {t("issuedBy")} {item.issuer}
            </p>
            <p className="mt-3 leading-7">{localize(item.description, locale)}</p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("visit")} ${t("newTab")}`}
                className={`mt-2 ${textLinkClass}`}
              >
                <span className={textLinkLabelClass}>{t("visit")}</span>
                <ArrowIcon className={textLinkArrowClass} />
              </a>
            )}
          </div>
        </li>
      ))}
    </ExperienceEntrance>
  );
}
