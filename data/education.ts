import type { Education } from "./types";

export const education = [
  {
    id: "puc-minas-software-engineering",
    course: {
      pt: "Pós-graduação Lato Sensu, Engenharia de Software",
      en: "Postgraduate specialization, Software Engineering",
    },
    institution: "PUC Minas",
    start: "2024-03",
    end: "2025-09",
  },
  {
    id: "uva-graphic-design",
    course: {
      pt: "Design Gráfico, Animação e Ilustração 3D",
      en: "Graphic Design, 3D Animation and Illustration",
    },
    institution: "Universidade Veiga de Almeida",
    start: "2012",
    end: "2018",
  },
] satisfies Education[];
