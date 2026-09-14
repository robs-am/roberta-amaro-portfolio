import type { Experience } from "./types";

export const experiences = [
  {
    id: "grupo-olx",
    role: {
      pt: "Engenheira de Software",
      en: "Software Engineer",
    },
    company: "Grupo OLX",
    start: "2024-12",
    description: {
      pt: "Como Engenheira de Software na vertical de imóveis da OLX, desenvolvo experiências para um dos maiores marketplaces imobiliários do Brasil — passando por produtos com IA, SEO, conversão e performance web — em colaboração próxima com Produto, Design e Engenharia.",
      en: "As a Software Engineer on OLX's real estate domain, I build experiences for one of Brazil's largest real estate marketplaces — spanning AI-powered products, SEO, conversion and web performance — working closely with Product, Design and Engineering.",
    },
  },
  {
    id: "ed3-digital",
    role: {
      pt: "Engenheira de Software Front-end",
      en: "Front-End Software Engineer",
    },
    company: "ED3 Digital",
    start: "2022-11",
    end: "2024-11",
    description: {
      pt: "Na ED3 Digital, desenvolvi e mantive lojas virtuais de marcas de moda e beleza no Brasil — incluindo Tommy Hilfiger, Creamy e Skelt — sendo responsável pelas funcionalidades de front-end de ponta a ponta, do repasse do Figma até o deploy.",
      en: "At ED3 Digital, I built and maintained e-commerce storefronts for fashion and beauty brands in Brazil — including Tommy Hilfiger, Creamy and Skelt — owning frontend features end-to-end, from Figma handoff to deployment.",
    },
  },
] satisfies Experience[];
