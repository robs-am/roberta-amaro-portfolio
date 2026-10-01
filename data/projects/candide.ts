import type { Project } from "../types";

export const project = {
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
    src: "/projects/candide-banner.webp",
    width: 1881,
    height: 877,
    focus: "50% 72%",
    alt: {
      pt: "Página inicial do e-commerce da Candide, com menu de categorias de brinquedos e banner da linha Bluey, com as pelúcias da família Heeler",
      en: "Candide e-commerce home page, with a toy category menu and a banner for the Bluey line, featuring plush toys of the Heeler family",
    },
  },
} satisfies Project;
