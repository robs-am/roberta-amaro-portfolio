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
    src: "/projects/skelt-thumb.webp",
    width: 1433,
    height: 552,
    focus: "50% 50%",
    alt: {
      pt: "Página inicial do e-commerce da Skelt, com banner em degradê coral do perfume capilar Amalfi Sunset, frasco entre flores e uma mecha de cabelo ondulado ao fundo",
      en: "Skelt e-commerce home page, with a coral-gradient banner for the Amalfi Sunset hair perfume, the bottle framed by flowers with a strand of wavy hair behind it",
    },
  },
} satisfies Project;
