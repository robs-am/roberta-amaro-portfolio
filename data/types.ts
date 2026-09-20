import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export type Localized = Record<Locale, string>;

export type Profile = {
  name: string;
  role: Localized;
  bio: Localized;
  /** Lead-in text for the second bio line, ending right before the interest list (no trailing space or punctuation). */
  focus: Localized;
  /** Highlighted interest terms, rendered as a comma/"and" list after `focus`. */
  interests: Localized[];
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

export type Award = {
  id: string;
  /** Placement, e.g. "3rd Place". */
  title: Localized;
  event: Localized;
  issuer: string;
  /** YYYY-MM */
  date: string;
  description: Localized;
  url?: string;
};

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  /** Makes the image (e.g. a gallery slice) a link to this URL. */
  href?: string;
};

export type Project = {
  id: string;
  category: Localized;
  title: Localized;
  description: Localized;
  /** What the author specifically did; shown in the card's hover/focus blurb. */
  contribution?: Localized;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: ProjectImage;
  /** Up to 3 screenshots, shown as diagonal slices in the card's panel instead of `image`. */
  images?: ProjectImage[];
  /** Shows this project in the home's curated highlights; the full list still appears on /projects. */
  featured?: boolean;
};

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}
