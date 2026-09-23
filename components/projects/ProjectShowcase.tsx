"use client";

import { useRef } from "react";
import { ProjectDialog } from "./ProjectDialog";
import { ProjectRow } from "./ProjectRow";
import type { ShowcaseItem, ShowcaseLabels } from "./types";
import { useProjectLightbox } from "./useProjectLightbox";
import { useShowcaseEntrance } from "./useShowcaseEntrance";

export function ProjectShowcase({
  title,
  intro,
  items,
  labels,
}: Readonly<{ title: string; intro?: string; items: ShowcaseItem[]; labels: ShowcaseLabels }>) {
  const rootRef = useRef<HTMLDivElement>(null);
  useShowcaseEntrance(rootRef);
  const lightbox = useProjectLightbox(items, rootRef);

  return (
    <div ref={rootRef} data-showcase>
      <div
        data-showcase-item
        className="flex items-baseline justify-between gap-6 border-b border-border pb-4"
      >
        <h1
          data-showcase-title
          className="font-display text-4xl leading-tight font-semibold sm:text-5xl"
        >
          {title}
        </h1>
        <span data-showcase-meta className="text-lg text-muted" aria-hidden="true">
          {items.length}
        </span>
      </div>

      {intro && <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{intro}</p>}

      <ul className="lg:mt-2">
        {items.map((item) => (
          <ProjectRow key={item.id} item={item} onOpen={lightbox.open} />
        ))}
      </ul>

      <ProjectDialog
        item={lightbox.openItem}
        hasSiblings={items.length > 1}
        labels={labels}
        dialogRef={lightbox.dialogRef}
        panelRef={lightbox.panelRef}
        contentRef={lightbox.contentRef}
        onClose={lightbox.requestClose}
        onStep={lightbox.step}
      />
    </div>
  );
}
