import { useLocale, useTranslations } from "next-intl";
import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

export type ContactLink = { href: string; label: string; external: boolean };

/** Résumé, e-mail, LinkedIn and GitHub, for whichever of them the profile has; shared by the menu and the footer. */
export function useContactLinks(): ContactLink[] {
  const t = useTranslations("Hero");
  const locale = useLocale() as Locale;

  return [
    profile.cvUrl && { href: localize(profile.cvUrl, locale), label: t("cv"), external: true },
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), external: true },
  ].filter((link): link is ContactLink => !!link);
}
