import type { Profile } from "./types";

export const profile = {
  name: "Roberta Amaro",
  role: {
    pt: "Engenheira de Software",
    en: "Software Engineer",
  },
  bio: {
    pt: "Transformo ideias em interfaces claras, rápidas e feitas para durar.",
    en: "I turn ideas into interfaces that are clear, fast and built to last.",
  },
  focus: {
    pt: "Tenho interesse especial em",
    en: "I'm particularly interested in",
  },
  interests: [
    { pt: "IA", en: "AI" },
    { pt: "performance", en: "performance" },
    { pt: "engenharia de produto", en: "product engineering" },
  ],
  email: "roberta.amaro89@gmail.com",
  linkedinUrl: "https://linkedin.com/in/roberta-amaro",
  githubUrl: "https://github.com/robs-am",
} satisfies Profile;
