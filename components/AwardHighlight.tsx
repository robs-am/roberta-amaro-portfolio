import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowIcon } from "@/components/ArrowIcon";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/textLinkStyles";
import { localize, type Award, type Locale } from "@/data/types";

// Awards that are not tied to a job. Each one is a single panel, so it reads as a highlight next
// to the timelines instead of one more entry in them.
export async function AwardHighlight({
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

  return (
    <ul className="space-y-6">
      {awards.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-accent/40 bg-card p-6 sm:p-8"
        >
          <h3 className="font-display text-2xl leading-[1.15] font-bold tracking-wide text-accent sm:text-3xl">
            {localize(item.event, locale)}
          </h3>
          <p className="mt-3 text-base font-semibold">{localize(item.title, locale)}</p>
          <p className="mt-1 text-sm text-muted">
            {t("issuedBy")} {item.issuer}
            {" - "}
            <time dateTime={item.date}>{formatMonth(item.date)}</time>
          </p>
          <p className="mt-4 leading-7">{localize(item.description, locale)}</p>
          {(item.url || item.certificateUrl) && (
            <div className="mt-3 flex flex-wrap gap-x-6">
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("visit")} ${t("newTab")}`}
                  className={textLinkClass}
                >
                  <span className={textLinkLabelClass}>{t("visit")}</span>
                  <ArrowIcon className={textLinkArrowClass} />
                </a>
              )}
              {item.certificateUrl && (
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("certificate")} ${t("newTab")}`}
                  className={textLinkClass}
                >
                  <span className={textLinkLabelClass}>{t("certificate")}</span>
                  <ArrowIcon className={textLinkArrowClass} />
                </a>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
