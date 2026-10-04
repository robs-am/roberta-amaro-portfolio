import type { Project, ProjectCase } from "../types";

export const project = {
  id: "pega-visao",
  featured: true,
  category: {
    pt: "IA e segurança pública",
    en: "AI and public safety",
  },
  title: {
    pt: "Pega Visão",
    en: "Pega Visão",
  },
  description: {
    pt: "Plataforma de inteligência criminal para o CompStat da Prefeitura do Rio, 3º lugar no Claude Impact Lab.",
    en: "Crime intelligence platform for the Rio City Hall's CompStat, 3rd place at the Claude Impact Lab.",
  },
  tech: ["Next.js", "React", "TypeScript", "PostgreSQL", "PostGIS", "Leaflet", "Python", "Claude API"],
  demoUrl: "https://www.pegavisao.xyz/",
  image: {
    src: "/projects/pega-visao-tela.webp",
    width: 1918,
    height: 924,
    focus: "25% 0%",
    alt: {
      pt: "Tela do Pega Visão, com o menu lateral (Mapa Operacional, Coincidências, Cobertura FM, Plano de Ação, RELINTs e Redes Sociais), o mapa de calor das ocorrências no Rio de Janeiro e o painel de análise por IA de uma área, com resumo executivo, dinâmica criminal e um mapa de calor por dia e hora",
      en: "Pega Visão screen, with the side menu (Operational Map, Coincidences, Municipal Force Coverage, Action Plan, Intelligence Reports and Social Media), the heat map of incidents in Rio de Janeiro and an area's AI analysis panel, with an executive summary, crime dynamics and a day-by-hour heat map",
    },
  },
} satisfies Project;

/** Long-form sections of the project's page (`/projects/[id]`). Written from the author's LinkedIn post about it. */
export const projectCase = {
  sections: [
    {
      id: "problema",
      label: { pt: "Problema", en: "Problem" },
      title: {
        pt: "Decidir onde alocar 600 agentes dependia de bases cruzadas à mão",
        en: "Deciding where to place 600 agents meant cross-referencing databases by hand",
      },
      body: [
        {
          pt: "Toda semana, a Força Municipal do Rio precisa decidir onde alocar seus 600 agentes, e os dados ficam espalhados em várias bases, cruzadas manualmente. A ideia foi automatizar esse cruzamento e reduzir o trabalho de horas para minutos.",
          en: "Every week, the Rio Municipal Force has to decide where to place its 600 agents, and the data is spread across several databases, cross-referenced by hand. The idea was to automate that and cut the work from hours to minutes.",
        },
        {
          pt: "Fizemos o projeto em equipe de quatro pessoas, no hackathon do Claude Impact Lab, no Rio de Janeiro, com dados reais da cidade fornecidos pela Secretaria de Segurança Pública: mais de 115 mil ocorrências georreferenciadas e 83 mil denúncias. Ficamos em 3º lugar na categoria Segurança.",
          en: "We built it as a team of four at the Claude Impact Lab hackathon in Rio de Janeiro, using real city data provided by the Public Security Secretariat: over 115,000 georeferenced incidents and 83,000 reports. We placed 3rd in the Security category.",
        },
      ],
    },
    {
      id: "plataforma",
      label: { pt: "Plataforma", en: "Platform" },
      title: {
        pt: "Um mapa, uma análise por IA e uma sugestão de cobertura no mesmo lugar",
        en: "A map, an AI analysis and a coverage suggestion in one place",
      },
      body: [
        {
          pt: "O mapa interativo reúne a mancha criminal, os fatores urbanos, as câmeras e as 22 áreas da Força Municipal, com filtros por período e por tipo de crime. Os pontos em que crime, fator urbano e denúncia se sobrepõem aparecem como coincidências de alto risco, com uma nota de criticidade.",
          en: "The interactive map brings together the crime heat, urban factors, cameras and the Municipal Force's 22 areas, with filters by period and crime type. Points where crime, an urban factor and a report overlap show up as high-risk coincidences, with a criticality score.",
        },
        {
          pt: "Para cada área, a IA sintetiza a série temporal e a dinâmica criminal e gera um relatório exportado em .docx. A sugestão de cobertura distribui os 600 agentes pelas áreas, com modelo de emprego e turnos prioritários, e os fatores urbanos são agrupados por órgão responsável, como Comlurb, RioLuz e CET-Rio. Os relatos da população no Twitter também entram, classificados por IA.",
          en: "For each area, the AI summarizes the time series and the crime dynamics and produces a report exported as .docx. The coverage suggestion spreads the 600 agents across the areas, with a deployment model and priority shifts, and urban factors are grouped by the agency in charge, such as Comlurb, RioLuz and CET-Rio. Residents' posts on Twitter are included too, classified by AI.",
        },
      ],
    },
    {
      id: "retomada",
      label: { pt: "Retomada", en: "Update" },
      title: {
        pt: "Retomei o projeto para ele funcionar bem no celular",
        en: "I came back to the project so it works well on a phone",
      },
      body: [
        {
          pt: "Depois do hackathon, retomei o projeto para otimizá-lo: deixei tudo responsivo, funcionando bem no celular, e acrescentei uma splash screen de abertura.",
          en: "After the hackathon, I came back to the project to polish it: I made everything responsive, working well on a phone, and added an opening splash screen.",
        },
      ],
    },
  ],
} satisfies ProjectCase;
