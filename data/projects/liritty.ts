import type { Project, ProjectCase } from "../types";

export const project = {
  id: "liritty",
  featured: true,
  category: {
    pt: "E-commerce",
    en: "E-commerce",
  },
  title: {
    pt: "Liritty",
    en: "Liritty",
  },
  description: {
    pt: "Rede de moda feminina do Rio de Janeiro com 18 lojas físicas.",
    en: "Women's fashion retailer with 18 physical stores in Rio de Janeiro.",
  },
  tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
  demoUrl: "https://www.liritty.com.br",
  image: {
    src: "/projects/liritty_thumb.webp",
    width: 1437,
    height: 815,
    focus: "50% 44%",
    alt: {
      pt: "Página inicial do e-commerce da Liritty, com banner de coleção de festival, menu com Shop, Estampas, Básicos e Jeans e Sarja, e uma foto de campanha com modelo sorrindo em um festival ao pôr do sol",
      en: "Liritty e-commerce home page, with a festival collection banner, Shop, Prints, Basics and Denim navigation, and a campaign photo of a model smiling at a festival at sunset",
    },
  },
} satisfies Project;

/** Long-form sections of the project's page (`/projects/[id]`); without it the page shows only the header, image and technologies. */
// TODO: first draft from short notes, with no numbers or before/after yet. Fill the gaps flagged below before publishing.
export const projectCase = {
  sections: [
    {
      id: "banner",
      label: { pt: "Banner", en: "Banner" },
      // TODO: finish what the link over the banner is for (a collection, a product, a campaign?), and say who uses it and how often.
      title: {
        pt: "Um componente inédito deu ao cliente o controle dos vídeos do banner, com link incluso",
        en: "A first-of-its-kind component gave the client control of the banner videos, link included",
      },
      body: [
        {
          pt: "Fiquei responsável por criar, em React, um componente customizado inédito: o cliente sobe os vídeos do banner e, ao mesmo tempo, define o link que fica sobre eles. Publicar ou trocar um banner deixou de depender de um desenvolvedor.",
          en: "I was responsible for building a first-of-its-kind custom component in React: the client uploads the banner videos and, at the same time, sets the link that sits over them. Publishing or swapping a banner no longer depends on a developer.",
        },
      ],
    },
    {
      id: "redesign",
      label: { pt: "Redesign", en: "Redesign" },
      // TODO: say what was wrong with the old showcases and recommendations and what the new ones do better, and any effect.
      title: {
        pt: "As vitrines, as recomendações e os demais componentes da home ganharam um novo visual",
        en: "The showcases, the recommendations and the rest of the home page's components got a new look",
      },
      body: [
        {
          pt: "Fiquei responsável pelo redesign dos componentes da home, das vitrines às recomendações, passando por todos os demais componentes da página.",
          en: "I was responsible for redesigning the home page's components, from the showcases to the recommendations and every other component on the page.",
        },
      ],
    },
  ],
} satisfies ProjectCase;
