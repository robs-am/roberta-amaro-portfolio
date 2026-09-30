import type { Project, ProjectCase } from "./types";

/**
 * Long-form sections of a project's page (`/projects/[id]`), keyed by project id. Every project has
 * the page; one without an entry here shows only the header, image and technologies.
 */
export const cases: Partial<Record<Project["id"], ProjectCase>> = {
  // TODO: placeholder text to see the layout. Replace with the real case before publishing.
  creamy: {
    sections: [
      {
        id: "contexto",
        label: { pt: "Contexto", en: "Context" },
        title: {
          pt: "[Exemplo] Um título que já diz a conclusão da seção",
          en: "[Example] A heading that already states the section's conclusion",
        },
        body: [
          {
            pt: "[Exemplo] Primeiro parágrafo, em primeira pessoa: o que eu resolvi e por quê.",
            en: "[Example] First paragraph, in first person: what I solved and why.",
          },
        ],
      },
      {
        id: "decisao",
        label: { pt: "Decisão", en: "Decision" },
        title: {
          pt: "[Exemplo] Uma decisão de projeto, com o motivo",
          en: "[Example] A design decision, with the reason",
        },
        body: [
          {
            pt: "[Exemplo] Texto da segunda seção.",
            en: "[Example] Text of the second section.",
          },
        ],
      },
      {
        id: "resultado",
        label: { pt: "Resultado", en: "Result" },
        title: {
          pt: "[Exemplo] O resultado, com número quando houver",
          en: "[Example] The outcome, with a number when there is one",
        },
        body: [
          {
            pt: "[Exemplo] Texto da terceira seção.",
            en: "[Example] Text of the third section.",
          },
        ],
      },
    ],
  },
};
