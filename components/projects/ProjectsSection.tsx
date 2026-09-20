import { getTranslations } from "next-intl/server";
import { textLinkArrowClass, textLinkClass, textLinkLabelClass } from "@/components/textLinkStyles";
import { projects } from "@/data/projects";
import type { Locale, Project } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "./ProjectCard";

const MAX_HIGHLIGHTED = 4;

// This section is pinned to one viewport (`h-[calc(100dvh-...)]` + `overflow-hidden` below), so
// highlighted cards must fit a single row rather than wrap or stagger. Below `sm` they're a
// swipeable row (native scroll-snap); from `sm` up, columns grow with the breakpoint (2/3/4) and
// each card stays hidden until its column exists, so the row never wraps to a second line.
const VISIBILITY_BY_INDEX = ["", "", "sm:hidden lg:block", "sm:hidden xl:block"];

export async function ProjectsSection({ locale }: Readonly<{ locale: Locale }>) {
  const t = await getTranslations("Projects");
  const featured = (projects as Project[]).filter((project) => project.featured);
  const highlighted = (featured.length > 0 ? featured : projects).slice(0, MAX_HIGHLIGHTED);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative left-1/2 w-screen -translate-x-1/2 snap-start h-[calc(100dvh-var(--header-height,0px))] overflow-hidden scroll-mt-(--header-height,0px) py-16"
    >
      {/* The section itself breaks out to the full viewport width (it would otherwise inherit
          `main`'s max-w-7xl). Content below is reined back into the same max-w-7xl column `main`
          uses everywhere else. */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="projects-title" className="text-3xl font-semibold">
            {t("title")}
          </h2>
          {projects.length > highlighted.length && (
            <Link
              href="/projects"
              className={textLinkClass}
            >
              <span className={textLinkLabelClass}>{t("viewAll")}</span>
              <ArrowIcon className={textLinkArrowClass} />
            </Link>
          )}
        </div>
        {/* Odd cards sit a little lower (`sm:translate-y-6`) for a hint of the /projects page's
            interleaved feel, kept small since this row has no room to spare inside the fixed
            viewport height above. */}
        <div className="scrollbar-hide mt-8 flex items-start snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:snap-none sm:gap-6 sm:overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {highlighted.map((project, index) => (
            <div
              key={project.id}
              className={`w-[85%] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-align-none ${VISIBILITY_BY_INDEX[index] ?? ""} ${index % 2 === 1 ? "sm:translate-y-6" : ""}`}
            >
              <ProjectCard project={project} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}
