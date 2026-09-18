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

  let primary: { href: string; label: string } | undefined;
  if (project.demoUrl) primary = { href: project.demoUrl, label: t("demo") };
  else if (project.repoUrl) primary = { href: project.repoUrl, label: t("repo") };

  const secondary =
    primary?.href === project.demoUrl && project.repoUrl
      ? { href: project.repoUrl, label: t("repo") }
      : undefined;

  return (
    <article
      data-reveal
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border transition-[transform,border-color] duration-300 ease-expressive hover:border-accent/60 focus-within:border-accent/60 motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden">
        {project.image ? (
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt={localize(project.image.alt, locale)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <div aria-hidden="true" className="project-panel h-full w-full rounded-xl" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {localize(project.category, locale)}
        </p>
        <h3 className="mt-1.5 flex items-start justify-between gap-3 text-xl font-semibold">
          {title}
          {primary && (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/cta inline-flex h-9 shrink-0 items-center gap-0 overflow-hidden rounded-full border border-accent/30 bg-accent/10 px-2.5 text-accent transition-[gap,padding,background-color,color,border-color] duration-300 ease-expressive motion-safe:group-hover:gap-2 group-hover:border-accent group-hover:bg-accent group-hover:pr-4 group-hover:text-accent-foreground focus-visible:gap-2 focus-visible:border-accent focus-visible:bg-accent focus-visible:pr-4 focus-visible:text-accent-foreground ${focusRing}`}
            >
              <ArrowIcon className="size-4 shrink-0" />
              <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-expressive motion-reduce:transition-none group-hover:grid-cols-[1fr] group-focus-visible/cta:grid-cols-[1fr]">
                <span className="overflow-hidden text-sm font-medium whitespace-nowrap">
                  {primary.label}
                </span>
              </span>
              <span className="sr-only">
                {title}, {primary.label} {t("newTab")}
              </span>
            </a>
          )}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          {localize(project.description, locale)}
        </p>
        {project.tech.length > 0 && (
          <p aria-label={t("tech")} className="mt-4 text-xs font-medium text-accent">
            {project.tech.join(" · ")}
          </p>
        )}
        {/* Always-visible cue for the hover-revealed blurb below, kept to just the chevron (the
            arrow-pill above already signals "clickable") so it doesn't stack another line of text
            on an already busy card. Tints accent and flips together with the reveal. */}
        <div className="mt-4 flex items-center text-muted transition-colors duration-300 ease-expressive group-hover:text-accent group-focus-within:text-accent">
          <span className="sr-only">{t("whatIDid")}</span>
          <ChevronIcon className="size-3.5 shrink-0 transition-transform duration-300 ease-expressive group-hover:rotate-180 group-focus-within:rotate-180" />
        </div>
        {/* Experiment: reveal a separate "what I did" blurb on hover/focus, below the tech line,
            so it doesn't butt straight up against the store description above. Lorem ipsum
            stand-in until we write real per-project copy for this part. */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-expressive motion-reduce:transition-none group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <p className="overflow-hidden pt-1 text-sm leading-6 text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec dolor at nunc
            feugiat cursus.
          </p>
        </div>

        {secondary && (
          <a
            href={secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-4 w-fit rounded-sm text-sm font-medium text-accent underline-offset-4 hover:underline ${focusRing}`}
          >
            {secondary.label}
            <span className="sr-only">, {title} {t("newTab")}</span>
          </a>
        )}
      </div>
    </article>
  );
}

function ArrowIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`size-4 ${className ?? ""}`}
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

function ChevronIcon({ className }: Readonly<{ className?: string }>) {
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
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}
