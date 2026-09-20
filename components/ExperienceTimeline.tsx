import { getFormatter, getTranslations } from "next-intl/server";
import { TimelineLine } from "@/components/TimelineLine";
import { localize, type Experience, type Locale } from "@/data/types";

function toDate(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

export async function ExperienceTimeline({
  experiences,
  locale,
}: Readonly<{
  experiences: Experience[];
  locale: Locale;
}>) {
  const t = await getTranslations("Experience");
  const format = await getFormatter();

  const formatMonth = (yearMonth: string) =>
    format.dateTime(toDate(yearMonth), { month: "short", year: "numeric" });

  return (
    <ol className="relative mt-10 ml-1.5 space-y-6 pl-6 sm:pl-8">
      <TimelineLine />
      {experiences.map((item, index) => (
        <li key={item.id} data-reveal className="relative max-w-3xl">
          {/* Desktop: one dot per card, on the line. Mobile: the card covers the line instead (see below). */}
          <span
            aria-hidden="true"
            className="absolute -left-6 top-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-background sm:-left-8 sm:block"
          />
          {/* Mobile only: connector dot centered in the gap above this card (none above the first card). */}
          {index > 0 && (
            <span
              aria-hidden="true"
              className="absolute -left-6 -top-4.5 size-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background sm:hidden"
            />
          )}
          <div className="-ml-8 rounded-xl border border-border bg-card py-5 pr-5 pl-14 sm:ml-0 sm:p-6">
            <p className="text-sm text-muted">
              <time dateTime={item.start}>{formatMonth(item.start)}</time>
              {" – "}
              {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : t("present")}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{localize(item.role, locale)}</h3>
            <p className="text-sm font-medium text-accent">{item.company}</p>
            <p className="mt-3 leading-7">{localize(item.description, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
