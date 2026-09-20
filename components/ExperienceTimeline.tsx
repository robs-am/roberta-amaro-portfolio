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
    <ol className="relative mt-10 ml-1.5 space-y-12 pl-6 sm:pl-8">
      <TimelineLine />
      {experiences.map((item) => (
        <li key={item.id} data-reveal className="relative max-w-3xl">
          {/* Sits on the line, level with the date. TimelineLine grows to this dot's center. */}
          <span
            aria-hidden="true"
            className="absolute -left-6 top-1 size-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background sm:-left-8"
          />
          <p className="text-sm text-muted">
            <time dateTime={item.start}>{formatMonth(item.start)}</time>
            {" – "}
            {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : t("present")}
          </p>
          <h3 className="mt-2 text-lg font-semibold">{localize(item.role, locale)}</h3>
          <p className="text-sm font-medium text-accent">{item.company}</p>
          <p className="mt-3 leading-7">{localize(item.description, locale)}</p>
        </li>
      ))}
    </ol>
  );
}
