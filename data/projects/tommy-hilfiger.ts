import type { Project } from "../types";

export const project = {
  id: "tommy-hilfiger",
  featured: true,
  category: {
    pt: "E-commerce",
    en: "E-commerce",
  },
  title: {
    pt: "Tommy Hilfiger",
    en: "Tommy Hilfiger",
  },
  description: {
    pt: "Marca global de moda presente em mais de 100 países.",
    en: "Global fashion brand present in more than 100 countries.",
  },
  tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
  demoUrl: "https://br.tommy.com/",
  image: {
    src: "/projects/tommy-hilfiger.webp",
    width: 1447,
    height: 826,
    focus: "50% 57%",
    alt: {
      pt: "Página inicial do e-commerce da Tommy Hilfiger, com faixa de frete grátis, menu Feminino, Masculino e Kids e uma foto de campanha com modelos em um terraço com prédios ao fundo",
      en: "Tommy Hilfiger e-commerce home page, with a free shipping banner, Women, Men and Kids navigation and a campaign photo of models on a rooftop with city buildings behind them",
    },
  },
} satisfies Project;
