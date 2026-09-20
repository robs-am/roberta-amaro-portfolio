import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
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

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
      <Link
        href="/"
        className="inline-block rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← {tPage("back")}
      </Link>
      <h1 className="mt-8 text-3xl font-semibold">
        {t("title")}
      </h1>
      {/* Capped narrower than the page's own max-w-7xl and centered: at full width, 2 columns of
          these landscape cards read as oversized. The offset on odd cards (`sm:translate-y-28`)
          reads as an interleaved pair of columns while scrolling; `gap-y-36` keeps that offset
          from overlapping the row below. A transform doesn't take up layout space, so `sm:pb-28`
          reserves the same offset at the bottom, keeping the last card clear of the footer. */}
      <div className="mx-auto mt-8 grid max-w-4xl items-start gap-x-16 gap-y-36 sm:grid-cols-2 sm:pb-28">
        {projects.map((project, index) => (
          <div key={project.id} className={index % 2 === 1 ? "sm:translate-y-28" : undefined}>
            <ProjectCard project={project} locale={locale} />
          </div>
        ))}
      </div>
    </main>
  );
}
