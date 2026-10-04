import type { Project } from "../types";

export const project = {
  id: "skelt",
  category: {
    pt: "E-commerce",
    en: "E-commerce",
  },
  title: {
    pt: "Skelt",
    en: "Skelt",
  },
  description: {
    pt: "Marca de autobronzeador que se posiciona como a mais vendida do Brasil na categoria.",
    en: "Self-tanner brand that positions itself as Brazil's best-selling in the category.",
  },
  tech: ["React", "TypeScript", "SASS", "VTEX"],
  demoUrl: "https://www.skelt.com.br",
  image: {
    src: "/projects/skelt-banner.webp",
    width: 1920,
    height: 618,
    fit: "contain",
    alt: {
      pt: "Banner do e-commerce da Skelt para o lançamento do perfume para cabelo Amalfi Sunset, com o frasco entre flores sobre um pedestal coral, uma mecha de cabelo ondulado ao fundo, a frase \"A fragrância mais amada de Skelt, agora para o seu cabelo\" e o botão Comprar Agora",
      en: "Skelt e-commerce banner for the launch of the Amalfi Sunset hair perfume, with the bottle among flowers on a coral pedestal, a strand of wavy hair behind it, the line \"The most loved fragrance from Skelt, now for your hair\" and a Buy Now button",
    },
  },
} satisfies Project;
