import { getFormatter, getTranslations } from "next-intl/server";
import { experiences } from "@/data/experiences";
import { localize, type Locale } from "@/data/types";

function toDate(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

export async function ExperienceSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("Experience");
  const format = await getFormatter();

  const formatMonth = (yearMonth: string) =>
    format.dateTime(toDate(yearMonth), { month: "short", year: "numeric" });

  const sorted = [...experiences].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-20 border-t border-border py-16"
    >
      <h2 id="experience-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <ol className="mt-10 ml-1.5 space-y-6 border-l border-accent/30 pl-6 sm:pl-8">
        {sorted.map((item) => (
          <li key={item.id} className="relative max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute -left-6 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-background sm:-left-8"
            />
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="text-sm text-muted">
                <time dateTime={item.start}>{formatMonth(item.start)}</time>
                {" – "}
                {item.end ? (
                  <time dateTime={item.end}>{formatMonth(item.end)}</time>
                ) : (
                  t("present")
                )}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{localize(item.role, locale)}</h3>
              <p className="text-sm font-medium text-accent">{item.company}</p>
              <p className="mt-3 leading-7">{localize(item.description, locale)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
