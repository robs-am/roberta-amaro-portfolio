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
    <ol className="mt-10 max-w-3xl space-y-14">
      {experiences.map((item) => (
        <li key={item.id} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
          <div>
            <p className="font-display text-5xl leading-none font-bold tracking-wide text-accent">
              {item.start.slice(0, 4)}
            </p>
            <p className="mt-3 text-sm text-muted">
              <time dateTime={item.start}>{formatMonth(item.start)}</time>
              {" – "}
              {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : t("present")}
            </p>
          </div>
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
