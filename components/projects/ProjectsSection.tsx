import { getTranslations } from "next-intl/server";
import { projects } from "@/data/projects";
import type { Locale } from "@/data/types";
import { ProjectCard } from "./ProjectCard";

export async function ProjectsSection({ locale }: Readonly<{ locale: Locale }>) {
  const t = await getTranslations("Projects");

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="snap-start h-[calc(100dvh-var(--header-height,0px))] overflow-y-auto scroll-mt-(--header-height,0px) border-t border-border py-16"
    >
      <h2 id="projects-title" data-reveal className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}
