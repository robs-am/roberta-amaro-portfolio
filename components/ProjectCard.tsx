import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { localize, type Locale, type Project } from "@/data/types";

export async function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = await getTranslations("Projects");
  const title = localize(project.title, locale);
  const linkContext = `${title} ${t("newTab")}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      {project.image && (
        <Image
          src={project.image.src}
          width={project.image.width}
          height={project.image.height}
          alt={localize(project.image.alt, locale)}
          className="aspect-video w-full border-b border-border object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 leading-7 text-muted">
          {localize(project.description, locale)}
        </p>
        <ul aria-label={t("tech")} className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
            >
              {tech}
            </li>
          ))}
        </ul>
        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            {project.repoUrl && (
              <ExternalLink href={project.repoUrl} label={t("repo")} context={linkContext} />
            )}
            {project.demoUrl && (
              <ExternalLink href={project.demoUrl} label={t("demo")} context={linkContext} />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ExternalLink({
  href,
  label,
  context,
}: {
  href: string;
  label: string;
  context: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-sm text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
      <span className="sr-only"> {context}</span>
    </a>
  );
}
