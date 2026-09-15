import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Hero } from "@/components/Hero";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[calc(100dvh-var(--header-height,0px))] max-w-5xl flex-col justify-center px-6 pb-16 sm:px-8 sm:pb-20 lg:pb-28"
    >
      <Hero locale={locale} />
    </main>
  );
}
