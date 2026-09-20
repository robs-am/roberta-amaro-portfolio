import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BackButton } from "@/components/BackButton";
import { alsoWorkingWith, mainStack } from "@/data/skills";
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

  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("About");

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-16 sm:px-8">
      <BackButton />
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-10 max-w-3xl space-y-6 text-lg leading-8">
        <p>{t("intro")}</p>
        <p>{t("curiosity")}</p>
      </div>

      <section aria-labelledby="stack-heading" className="mt-16">
        <h2
          id="stack-heading"
          className="border-b border-border pb-3 text-sm font-medium tracking-wide text-muted uppercase"
        >
          {t("stack")}
        </h2>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-display text-2xl leading-[1.1] font-bold tracking-wide uppercase sm:text-3xl">
          {mainStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <h3 className="mt-8 text-sm font-medium tracking-wide text-muted uppercase">
          {t("alsoWorking")}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-base font-semibold text-accent sm:text-lg">
          {alsoWorkingWith.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
