import type { Project } from "./types";

export const projects = [
  {
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
      width: 1280,
      height: 720,
      focus: "50% 66%",
      alt: {
        pt: "Página inicial do e-commerce da Tommy Hilfiger, com faixa de frete grátis, menu Feminino, Masculino e Kids e uma foto de campanha com modelos em um terraço com prédios ao fundo",
        en: "Tommy Hilfiger e-commerce home page, with a free shipping banner, Women, Men and Kids navigation and a campaign photo of models on a rooftop with city buildings behind them",
      },
    },
  },
  {
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
  },
  {
    id: "candide",
    featured: true,
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Candide",
      en: "Candide",
    },
    description: {
      pt: "Distribuidora brasileira de brinquedos com mais de 55 anos de mercado.",
      en: "Brazilian toy distributor with over 55 years in the market.",
    },
    tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
    demoUrl: "https://www.candide.com.br",
    image: {
      src: "/projects/candide.webp",
      width: 1440,
      height: 900,
      focus: "50% 55%",
      alt: {
        pt: "Página inicial do e-commerce da Candide, com menu de categorias de brinquedos e banner da linha Bluey, com as pelúcias da família Heeler",
        en: "Candide e-commerce home page, with a toy category menu and a banner for the Bluey line, featuring plush toys of the Heeler family",
      },
    },
  },
  {
    id: "creamy",
    featured: true,
    category: {
      pt: "E-commerce",
      en: "E-commerce",
    },
    title: {
      pt: "Creamy Skincare",
      en: "Creamy Skincare",
    },
    description: {
      pt: "Marca de dermocosméticos que já ultrapassou R$1 bilhão em faturamento acumulado.",
      en: "Dermocosmetics brand that has already surpassed R$1 billion in cumulative revenue.",
    },
    tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
    demoUrl: "https://www.creamy.com.br",
    image: {
      src: "/projects/creamy-thumb.webp",
      width: 1440,
      height: 807,
      focus: "50% 33%",
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
  },
] satisfies Project[];
