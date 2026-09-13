import type { Experience } from "./types";

// Sample content: replace with real experience.
export const experiences = [
  {
    id: "empresa-exemplo-b",
    role: {
      pt: "Desenvolvedora Front-end",
      en: "Front-end Developer",
    },
    company: "Empresa Exemplo B",
    start: "2021-02",
    end: "2023-12",
    description: {
      pt: "Desenvolvimento de um painel administrativo em React e criação de uma biblioteca de componentes compartilhada entre três produtos.",
      en: "Built a React admin dashboard and created a component library shared across three products.",
    },
  },
  {
    id: "empresa-exemplo-a",
    role: {
      pt: "Desenvolvedora Front-end Sênior",
      en: "Senior Front-end Developer",
    },
    company: "Empresa Exemplo A",
    start: "2024-03",
    description: {
      pt: "Liderança técnica do front-end de uma plataforma de e-commerce em Next.js, com foco em performance e acessibilidade.",
      en: "Front-end technical lead for a Next.js e-commerce platform, focused on performance and accessibility.",
    },
  },
  {
    id: "empresa-exemplo-c",
    role: {
      pt: "Desenvolvedora Júnior",
      en: "Junior Developer",
    },
    company: "Empresa Exemplo C",
    start: "2019-03",
    end: "2021-01",
    description: {
      pt: "Manutenção de sites institucionais e implementação de layouts responsivos a partir de protótipos.",
      en: "Maintained corporate websites and implemented responsive layouts from design mockups.",
    },
  },
] satisfies Experience[];
