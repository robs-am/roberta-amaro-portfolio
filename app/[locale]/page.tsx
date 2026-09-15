import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-6 sm:px-8">
      <Hero locale={locale} />
      <ExperienceSection locale={locale} />
      <ProjectsSection locale={locale} />
    </main>
  );
}
