import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export type Localized = Record<Locale, string>;

export type Profile = {
  name: string;
  role: Localized;
  bio: Localized;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

export type Experience = {
  id: string;
  role: Localized;
  company: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; omitted for the current position */
  end?: string;
  description: Localized;
};

export type Project = {
  id: string;
  category: Localized;
  title: Localized;
  description: Localized;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: Localized;
  };
};

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}
