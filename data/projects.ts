import type { Project } from "./types";

export const projects = [
  {
    id: "simulador-mcmv",
    featured: true,
    category: {
      pt: "Simulador",
      en: "Simulator",
    },
    title: {
      pt: "Simulador Minha Casa Minha Vida",
      en: "Minha Casa Minha Vida Simulator",
    },
    description: {
      pt: "Simulador de financiamento do programa usado no ZAP Imóveis, Viva Real e OLX.",
      en: "Program financing simulator used on ZAP Imóveis, Viva Real and OLX.",
    },
    contribution: {
      pt: "Facelift da página, melhorando a experiência do usuário na simulação.",
      en: "Facelift of the page, improving the user experience during the simulation.",
    },
    tech: ["Next.js", "TypeScript", "REST", "Strapi"],
    demoUrl: "https://www.zapimoveis.com.br/simulador-minha-casa-minha-vida/",
    images: [
      {
        src: "/projects/zap_mcmv.png",
        href: "https://www.zapimoveis.com.br/simulador-minha-casa-minha-vida/",
        width: 1918,
        height: 793,
        alt: {
          pt: "Simulador Minha Casa Minha Vida no ZAP Imóveis, com título, botão \"Começar a simulação\" e foto de uma sala de estar com varanda ao fundo",
          en: "Minha Casa Minha Vida simulator on ZAP Imóveis, with a title, a \"Start simulation\" button and a photo of a living room with a balcony behind it",
        },
      },
      {
        src: "/projects/vivareal_mcmv.png",
        href: "https://www.vivareal.com.br/simulador-minha-casa-minha-vida",
        width: 1906,
        height: 814,
        alt: {
          pt: "Simulador Minha Casa Minha Vida no Viva Real, com título, botão \"Começar a simulação\" e foto de uma sala com sofá azul e quadros na parede",
          en: "Minha Casa Minha Vida simulator on Viva Real, with a title, a \"Start simulation\" button and a photo of a living room with a blue sofa and framed pictures on the wall",
        },
      },
      {
        src: "/projects/olx_mcmv.png",
        href: "https://www.olx.com.br/simulador-minha-casa-minha-vida",
        width: 1914,
        height: 832,
        alt: {
          pt: "Simulador Minha Casa Minha Vida na OLX, com título, botão \"Começar a simulação\" e foto de uma sala com sofá de canto, televisão e estante",
          en: "Minha Casa Minha Vida simulator on OLX, with a title, a \"Start simulation\" button and a photo of a living room with a corner sofa, a TV and a bookshelf",
        },
      },
    ],
  },
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
      alt: {
        pt: "Página inicial do e-commerce da Skelt, com banner em degradê coral do perfume capilar Amalfi Sunset, frasco entre flores e uma mecha de cabelo ondulado ao fundo",
        en: "Skelt e-commerce home page, with a coral-gradient banner for the Amalfi Sunset hair perfume, the bottle framed by flowers with a strand of wavy hair behind it",
      },
    },
  },
] satisfies Project[];
