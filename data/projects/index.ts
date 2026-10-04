import type { Project, ProjectCase } from "../types";
import { project as candide } from "./candide";
import { project as creamy, projectCase as creamyCase } from "./creamy";
import { project as liritty } from "./liritty";
import { project as pegaVisao, projectCase as pegaVisaoCase } from "./pega-visao";
import { project as skelt } from "./skelt";
import { project as tommyHilfiger } from "./tommy-hilfiger";

/** Order here is the order on the site. One file per project in this folder; add the import and the entry. */
export const projects: Project[] = [pegaVisao, tommyHilfiger, liritty, candide, creamy, skelt];

/**
 * Long-form sections of a project's page (`/projects/[id]`), keyed by project id. A project without
 * an entry shows only the header, image and technologies. Each file exports its own `projectCase`.
 */
export const cases: Partial<Record<Project["id"], ProjectCase>> = {
  [creamy.id]: creamyCase,
  [pegaVisao.id]: pegaVisaoCase,
};
