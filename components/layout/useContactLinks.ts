import { useTranslations } from "next-intl";
import { profile } from "@/data/profile";

export type ContactLink = { href: string; label: string; external: boolean };

/** E-mail, LinkedIn and GitHub, for whichever of them the profile has; shared by the menu and the footer. */
export function useContactLinks(): ContactLink[] {
  const t = useTranslations("Hero");

  return [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), external: true },
  ].filter((link): link is ContactLink => !!link);
}
