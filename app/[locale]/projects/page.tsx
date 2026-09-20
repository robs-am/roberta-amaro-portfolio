import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ProjectShowcase, type ShowcaseItem } from "@/components/projects/ProjectShowcase";
import { projects } from "@/data/projects";
import { localize, type Project } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    alternates: {
      canonical: `/${locale}/projects`,
      languages: Object.fromEntries(
        routing.locales.map((option) => [option, `/${option}/projects`]),
      ),
    },
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Projects");
  const tPage = await getTranslations("ProjectsPage");

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
        alt: localize(image.alt, locale),
      })),
    };
  });

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-16 sm:px-8">
      <Link
        href="/"
        className="inline-block rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← {tPage("back")}
      </Link>
      <h1 className="mt-8 text-3xl font-semibold">
        {t("title")}
      </h1>
      <div className="mt-12">
        <ProjectShowcase
          items={items}
          labels={{
            visit: t("demo"),
            newTab: t("newTab"),
            tech: t("tech"),
            whatIDid: t("whatIDid"),
          }}
        />
      </div>
    </main>
  );
}
