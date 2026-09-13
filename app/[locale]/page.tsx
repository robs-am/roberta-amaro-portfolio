import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6">
      <Hero locale={locale} />
      <ExperienceSection locale={locale} />
      <ProjectsSection locale={locale} />
    </main>
  );
}
