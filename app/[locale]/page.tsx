import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Hero } from "@/components/Hero";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-8">
      <Hero locale={locale} />
    </main>
  );
}
