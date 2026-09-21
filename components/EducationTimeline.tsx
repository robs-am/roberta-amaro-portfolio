import { getFormatter, getTranslations } from "next-intl/server";
import { ExperienceEntrance } from "@/components/ExperienceEntrance";
import { localize, type Education, type Locale } from "@/data/types";

export async function EducationTimeline({
  education,
  locale,
}: Readonly<{
  education: Education[];
  locale: Locale;
}>) {
  const t = await getTranslations("Experience");
  const format = await getFormatter();

  // A bare year ("2012") has no month to show; "YYYY-MM" gets the usual short month.
  const formatDate = (value: string) => {
    const [year, month] = value.split("-").map(Number);
    if (!month) return String(year);
    return format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ExperienceEntrance className="mt-10 max-w-3xl space-y-14 short:mt-4 short:space-y-6">
      {education.map((item) => (
        <li key={item.id} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
          <div>
            <p
              data-experience-year
              className="w-fit font-display text-5xl leading-none font-bold tracking-wide text-accent"
            >
              {(item.end ?? item.start).slice(0, 4)}
            </p>
            <p data-experience-body className="mt-3 text-sm text-muted">
              <time dateTime={item.start}>{formatDate(item.start)}</time>
              {" - "}
              {item.end ? <time dateTime={item.end}>{formatDate(item.end)}</time> : t("inProgress")}
            </p>
          </div>
          <div data-experience-body>
            <h3 className="text-lg font-semibold">{localize(item.course, locale)}</h3>
            <p className="text-sm font-medium text-accent">{item.institution}</p>
          </div>
        </li>
      ))}
    </ExperienceEntrance>
  );
}
