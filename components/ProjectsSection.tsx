import { getTranslations } from "next-intl/server";
import { projects } from "@/data/projects";
import type { Locale } from "@/data/types";
import { ProjectCard } from "./ProjectCard";

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("Projects");

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-28 border-t border-border py-16 sm:scroll-mt-20"
    >
      <h2 id="projects-title" className="text-2xl font-semibold">
        {t("title")}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}
