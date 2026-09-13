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
      className="scroll-mt-28 border-t border-border py-16 sm:scroll-mt-20"
    >
      <h2 id="experience-title" className="text-2xl font-semibold tracking-tight">
        {t("title")}
      </h2>
      <ol className="mt-8 space-y-10">
        {sorted.map((item) => (
          <li key={item.id} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <p className="text-sm text-muted sm:pt-0.5">
              <time dateTime={item.start}>{formatMonth(item.start)}</time>
              {" – "}
              {item.end ? (
                <time dateTime={item.end}>{formatMonth(item.end)}</time>
              ) : (
                t("present")
              )}
            </p>
            <div>
              <h3 className="font-semibold">{localize(item.role, locale)}</h3>
              <p className="text-sm text-muted">{item.company}</p>
              <p className="mt-2 leading-7">{localize(item.description, locale)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
