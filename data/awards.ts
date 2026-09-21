import type { Award } from "./types";

export const awards = [
  {
    id: "claude-impact-lab-rio",
    title: { pt: "3º Lugar", en: "3rd Place" },
    event: { pt: "Claude Impact Lab, Rio de Janeiro", en: "Claude Impact Lab, Rio de Janeiro" },
    issuer: "Anthropic",
    date: "2026-05",
    description: {
      pt: "Desenvolvi uma solução com IA usando dados reais de segurança pública fornecidos pela Secretaria de Estado de Segurança Pública.",
      en: "Developed an AI-powered solution using real-world public safety data provided by the State Secretariat of Public Security.",
    },
    url: "https://www.pegavisao.xyz/",
  },
  {
    id: "olx-internal-hackathon",
    title: { pt: "1º Lugar", en: "1st Place" },
    event: { pt: "Hackathon Interno OLX", en: "OLX Internal Hackathon" },
    issuer: "Grupo OLX",
    experienceId: "grupo-olx",
    date: "2025-08",
    description: {
      pt: "Desenvolvi uma solução com IA para Trust & Safety, conquistando o 1º lugar entre as equipes participantes.",
      en: "Developed an AI-powered solution for Trust & Safety, winning 1st place among participating teams.",
    },
  },
] satisfies Award[];
