import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { localize, type Locale, type Project } from "@/data/types";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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

  const links = [
    project.demoUrl && { href: project.demoUrl, label: t("demo") },
    project.repoUrl && { href: project.repoUrl, label: t("repo") },
  ].filter((link) => !!link);
  const [primary, secondary] = links;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-video overflow-hidden border-b border-border">
        {project.image ? (
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt={localize(project.image.alt, locale)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="project-panel h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {localize(project.category, locale)}
        </p>
        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 leading-7 text-muted">{localize(project.description, locale)}</p>
        <ul aria-label={t("tech")} className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-elevated px-2.5 py-0.5 text-xs font-medium text-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        {primary && (
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-accent-foreground transition-colors hover:bg-accent/90 ${focusRing}`}
            >
              {primary.label}
              <ArrowIcon />
              <span className="sr-only"> {linkContext}</span>
            </a>
            {secondary && (
              <a
                href={secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-sm text-accent underline-offset-4 hover:underline ${focusRing}`}
              >
                {secondary.label}
                <span className="sr-only"> {linkContext}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
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
