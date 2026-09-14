import { getTranslations } from "next-intl/server";
import { projects } from "@/data/projects";
import type { Locale } from "@/data/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectsCarousel } from "./ProjectsCarousel";

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("Projects");
  const dotLabels = projects.map((_, index) => t("goToProject", { index: index + 1 }));

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-20 border-t border-border py-16"
    >
      <h2 id="projects-title" data-reveal className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <div className="mt-8">
        <ProjectsCarousel dotLabels={dotLabels}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </ProjectsCarousel>
      </div>
    </section>
  );
}
