import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ProjectCaseNav } from "@/components/projects/ProjectCaseNav";
import { ProjectImages } from "@/components/projects/ProjectImages";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { cases, projects } from "@/data/projects";
import { siteUrl } from "@/data/site";
import { localize, type Project } from "@/data/types";
import { alternatesFor } from "@/i18n/alternates";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const list: Project[] = projects;

// Every project has a page; each project's `data/projects/<id>.ts` only adds the long-form sections to it.
export const dynamicParams = false;

export function generateStaticParams() {
  return list.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = list.find((item) => item.id === slug);
  if (!project) notFound();

  return {
    metadataBase: new URL(siteUrl),
    title: localize(project.title, locale),
    description: localize(project.description, locale),
    alternates: alternatesFor(locale, `/projects/${slug}`),
  };
}

export default async function ProjectCasePage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const project = list.find((item) => item.id === slug);
  if (!project) notFound();

  const sections = cases[project.id]?.sections ?? [];
  const t = await getTranslations("ProjectCase");
  const tProjects = await getTranslations("Projects");
  const href = project.demoUrl ?? project.repoUrl;
  const images = (project.images ?? (project.image ? [project.image] : [])).map((image) => ({
    ...image,
    alt: localize(image.alt, locale),
  }));

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 pt-8 pb-24 sm:px-8 sm:pt-12 short:pt-6 short:pb-6">
      <header>
        <Link href="/projects" className={textLinkClass}>
          <svg
            viewBox="0 0 16 16"
            className="size-4 shrink-0 transition-transform duration-300 ease-expressive motion-safe:group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13 8H3M7 4 3 8l4 4" />
          </svg>
          <span className={textLinkLabelClass}>{t("back")}</span>
        </Link>
        <p className="mt-6 text-sm text-muted">{localize(project.category, locale)}</p>
        {/* The link to the site sits on the title's row, at the end of the full width (where the image ends); on a narrow
            screen it wraps under the title. The text below keeps its narrower column. */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
            {localize(project.title, locale)}
          </h1>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-fit ${textLinkClass}`}
            >
              <span className={textLinkLabelClass}>{t("visit")}</span>
              <ArrowIcon className={textLinkArrowClass} />
              <span className="sr-only">{t("newTab")}</span>
            </a>
          )}
        </div>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{localize(project.description, locale)}</p>

        <section aria-labelledby="tech-heading" className="mt-6 max-w-3xl">
          <h2 id="tech-heading" className="text-sm font-medium tracking-wide text-muted uppercase">
            {tProjects("tech")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </header>

      {images.length > 0 && (
        <div className="mt-10 aspect-video max-h-[32rem] w-full overflow-hidden rounded-xl bg-elevated">
          <ProjectImages images={images} sizes="(min-width: 1280px) 1200px, 100vw" priority />
        </div>
      )}

      {sections.length > 0 && (
      <div className="mt-16 lg:grid lg:grid-cols-[14rem_minmax(0,48rem)] lg:gap-x-16">
        <ProjectCaseNav
          label={t("onThisPage")}
          sections={sections.map((section) => ({
            id: section.id,
            label: localize(section.label, locale),
          }))}
        />

        <div className="space-y-24">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-24"
            >
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                {String(index + 1).padStart(2, "0")}. {localize(section.label, locale)}
              </p>
              <h2
                id={`${section.id}-title`}
                className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-4xl"
              >
                {localize(section.title, locale)}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-8 text-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph.pt}>{localize(paragraph, locale)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      )}
    </main>
  );
}
