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
  images: ShowcaseImage[];
  description: string;
  contribution?: string;
  tech: string[];
};

export type ShowcaseLabels = {
  visit: string;
  newTab: string;
  tech: string;
  whatIDid: string;
  close: string;
  previous: string;
  next: string;
};
