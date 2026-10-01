import type { Project } from "../types";

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
