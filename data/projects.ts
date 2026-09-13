import type { Project } from "./types";

// Sample content: replace with real projects.
export const projects = [
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
