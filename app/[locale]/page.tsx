import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Hero } from "@/components/Hero";
import { profile } from "@/data/profile";
import { siteUrl } from "@/data/site";
import { alsoWorkingWith, mainStack } from "@/data/skills";
import { localize } from "@/data/types";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: localize(profile.role, locale),
    description: localize(profile.bio, locale),
    url: `${siteUrl}/${locale}`,
    sameAs: [profile.linkedinUrl, profile.githubUrl].filter(Boolean),
    knowsAbout: [...mainStack, ...alsoWorkingWith],
  };

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
      <Hero locale={locale} />
    </main>
  );
}
