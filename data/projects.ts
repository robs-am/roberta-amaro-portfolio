import type { Project } from "./types";

// Real projects first; the entries after Tommy Hilfiger are sample content.
export const projects = [
  {
    id: "tommy-hilfiger",
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Tommy Hilfiger",
      en: "Tommy Hilfiger",
    },
    description: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    tech: ["VTEX", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://br.tommy.com/",
    image: {
      src: "/projects/tommy-hilfiger.webp",
      width: 1280,
      height: 720,
      alt: {
        pt: "Página inicial do e-commerce da Tommy Hilfiger, com faixa de frete grátis, menu Feminino, Masculino e Kids e uma foto de campanha com modelos em um terraço com prédios ao fundo",
        en: "Tommy Hilfiger e-commerce home page, with a free shipping banner, Women, Men and Kids navigation and a campaign photo of models on a rooftop with city buildings behind them",
      },
    },
  },
  {
    id: "liritty",
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Liritty",
      en: "Liritty",
    },
    description: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    tech: ["VTEX", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://www.liritty.com.br",
    image: {
      src: "/projects/liritty_thumb.webp",
      width: 1437,
      height: 815,
      alt: {
        pt: "Página inicial do e-commerce da Liritty, com banner de coleção de festival, menu com Shop, Estampas, Básicos e Jeans e Sarja, e uma foto de campanha com modelo sorrindo em um festival ao pôr do sol",
        en: "Liritty e-commerce home page, with a festival collection banner, Shop, Prints, Basics and Denim navigation, and a campaign photo of a model smiling at a festival at sunset",
      },
    },
  },
  {
    id: "candide",
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Candide",
      en: "Candide",
    },
    description: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    tech: ["VTEX", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://www.candide.com.br",
    image: {
      src: "/projects/candide.webp",
      width: 1437,
      height: 808,
      alt: {
        pt: "Página inicial do e-commerce da Candide, com menu de categorias de brinquedos (Funko, Bonecas, Carrinhos, Blocos de Montar) e banner da linha Guerreiras do K-Pop, da Netflix",
        en: "Candide e-commerce home page, with a toy category menu (Funko, Dolls, Toy Cars, Building Blocks) and a banner for Netflix's KPop Demon Hunters toy line",
      },
    },
  },
  {
    id: "creamy",
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Creamy Skincare",
      en: "Creamy Skincare",
    },
    description: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    tech: ["VTEX", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://www.creamy.com.br",
    image: {
      src: "/projects/creamy-thumb.webp",
      width: 1440,
      height: 807,
      alt: {
        pt: "Página inicial do e-commerce da Creamy Skincare, com banner de 15% de desconto no Pix e foto de uma mulher se olhando no espelho segurando produtos da linha",
        en: "Creamy Skincare e-commerce home page, with a 15%-off banner and a photo of a woman looking in a mirror holding products from the line",
      },
    },
  },
  {
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
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    tech: ["VTEX", "React", "TypeScript", "SASS"],
    demoUrl: "https://www.skelt.com.br",
    image: {
      src: "/projects/skelt-thumb.webp",
      width: 1433,
      height: 552,
      alt: {
        pt: "Página inicial do e-commerce da Skelt, com banner em degradê coral do perfume capilar Amalfi Sunset, frasco entre flores e uma mecha de cabelo ondulado ao fundo",
        en: "Skelt e-commerce home page, with a coral-gradient banner for the Amalfi Sunset hair perfume, the bottle framed by flowers with a strand of wavy hair behind it",
      },
    },
  },
] satisfies Project[];
