import type { Profile } from "./types";

export const profile = {
  name: "Roberta Amaro",
  role: {
    pt: "Desenvolvedora Front-end",
    en: "Front-end Developer",
  },
  bio: {
    pt: "Texto de exemplo: desenvolvo interfaces web acessíveis e rápidas com React, Next.js e TypeScript. Substitua este parágrafo por uma apresentação real.",
    en: "Sample text: I build accessible, fast web interfaces with React, Next.js and TypeScript. Replace this paragraph with a real introduction.",
  },
} satisfies Profile;
