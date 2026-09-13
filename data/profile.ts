import type { Profile } from "./types";

export const profile = {
  name: "Roberta Amaro",
  role: {
    pt: "Desenvolvedora Front-end",
    en: "Front-end Developer",
  },
  bio: {
    pt: "Engenheira de software especializada em transformar ideias em produtos confiáveis e centrados no usuário.",
    en: "I'm a Software Engineer who enjoys turning ideas into reliable and user-centered products.",
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
