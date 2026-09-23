import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ProjectShowcase, type ShowcaseItem } from "@/components/projects/ProjectShowcase";
import { projects } from "@/data/projects";
import { localize, type Project } from "@/data/types";
import { siteUrl } from "@/data/site";
import { alternatesFor } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/projects"),
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Projects");

  const list: Project[] = projects;
  const items: ShowcaseItem[] = list.flatMap((project) => {
    const href = project.demoUrl ?? project.repoUrl;
    if (!href) return [];
    const images = project.images ?? (project.image ? [project.image] : []);
    return {
      id: project.id,
      title: localize(project.title, locale),
      category: localize(project.category, locale),
      href,
      description: localize(project.description, locale),
      contribution: project.contribution && localize(project.contribution, locale),
      tech: project.tech,
      images: images.map((image) => ({
        src: image.src,
        width: image.width,
        height: image.height,
        focus: image.focus,
        alt: localize(image.alt, locale),
      })),
    };
  });

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 pt-8 pb-16 sm:px-8 sm:pt-12 short:pt-6 short:pb-6">
      <ProjectShowcase
        title={t("title")}
        intro={t("intro")}
        items={items}
        labels={{
          visit: t("demo"),
          newTab: t("newTab"),
          tech: t("tech"),
          whatIDid: t("whatIDid"),
          close: t("close"),
          previous: t("previous"),
          next: t("next"),
        }}
      />
    </main>
  );
}
