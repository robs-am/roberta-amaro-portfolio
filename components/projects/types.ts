export type ShowcaseImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  focus?: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  href: string;
  /** Path of the project's own page, when it has one; the card links there instead of opening the lightbox. */
  caseHref?: string;
  images: ShowcaseImage[];
  description: string;
  contribution?: string;
  tech: string[];
};

export type ShowcaseLabels = {
  visit: string;
  viewCase: string;
  newTab: string;
  tech: string;
  whatIDid: string;
  close: string;
  previous: string;
  next: string;
};
