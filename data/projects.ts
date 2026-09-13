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
    tech: ["VTEX", "React", "Tailwind CSS"],
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
    id: "painel-financeiro",
    category: {
      pt: "Aplicação web",
      en: "Web app",
    },
    title: {
      pt: "Painel Financeiro",
      en: "Finance Dashboard",
    },
    description: {
      pt: "Aplicação para acompanhar gastos mensais com gráficos e filtros por categoria.",
      en: "App for tracking monthly expenses with charts and category filters.",
    },
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    repoUrl: "https://example.com/repo/painel-financeiro",
    demoUrl: "https://example.com/demo/painel-financeiro",
    image: {
      src: "/projects/painel-financeiro.svg",
      width: 640,
      height: 360,
      alt: {
        pt: "Tela do painel financeiro com gráfico de barras de gastos mensais",
        en: "Finance dashboard screen with a bar chart of monthly expenses",
      },
    },
  },
  {
    id: "cli-tarefas",
    category: {
      pt: "Ferramenta CLI",
      en: "CLI tool",
    },
    title: {
      pt: "CLI de Tarefas",
      en: "Task CLI",
    },
    description: {
      pt: "Ferramenta de linha de comando para organizar tarefas locais em listas.",
      en: "Command-line tool for organizing local tasks into lists.",
    },
    tech: ["Node.js", "TypeScript"],
    repoUrl: "https://example.com/repo/cli-tarefas",
  },
  {
    id: "landing-evento",
    category: {
      pt: "Landing page",
      en: "Landing page",
    },
    title: {
      pt: "Landing Page de Evento",
      en: "Event Landing Page",
    },
    description: {
      pt: "Página de divulgação de um evento de tecnologia com inscrição e agenda.",
      en: "Promotional page for a tech event with registration and schedule.",
    },
    tech: ["React", "CSS Modules"],
    repoUrl: "https://example.com/repo/landing-evento",
    demoUrl: "https://example.com/demo/landing-evento",
  },
] satisfies Project[];
