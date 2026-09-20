import { getFormatter, getTranslations } from "next-intl/server";
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
    <ol className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
      {experiences.map((item) => (
        <li
          key={item.id}
          data-reveal
          className="grid gap-2 py-8 sm:grid-cols-[13rem_1fr] sm:gap-8"
        >
          <p className="text-sm text-muted sm:pt-1">
            <time dateTime={item.start}>{formatMonth(item.start)}</time>
            {" – "}
            {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : t("present")}
          </p>
          <div>
            <h3 className="text-lg font-semibold">{localize(item.role, locale)}</h3>
            <p className="text-sm font-medium text-accent">{item.company}</p>
            <p className="mt-3 leading-7">{localize(item.description, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
