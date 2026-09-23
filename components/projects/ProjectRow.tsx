import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { ProjectImages } from "./ProjectImages";
import type { ShowcaseItem, ShowcaseLabels } from "./types";

/**
 * One row of the projects list. The title is the button that opens the lightbox; its `::after`
 * stretches over the whole row so the image opens it too, and the "visit site" link sits above that
 * layer (a link can't live inside the button, and it must not open the lightbox).
 */
export function ProjectRow({
  item,
  labels,
  onOpen,
}: Readonly<{
  item: ShowcaseItem;
  labels: Pick<ShowcaseLabels, "visit" | "newTab">;
  onOpen: (id: string, trigger: HTMLElement) => void;
}>) {
  return (
    <li data-showcase-item className="group/row border-b border-border py-6 last:border-b-0 lg:py-4">
      {/* The containing block for the button's stretched `::after`: the row itself, without the
          li's padding and border, so the focus ring hugs the card. */}
      <div className="relative lg:grid lg:h-48 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div
          data-showcase-image
          className="relative mb-6 block aspect-video overflow-hidden rounded-xl bg-elevated lg:mb-0 lg:aspect-auto lg:rounded-lg lg:rounded-tr-[3rem]"
        >
          <span className="absolute inset-0 block transition-transform duration-700 ease-soft group-hover/row:scale-105 motion-reduce:transition-none">
            <ProjectImages images={item.images} sizes="(min-width: 1024px) 60vw, 100vw" />
          </span>
          {/* Evens out the very different screenshots on the page; lifts on hover, and the
              lightbox shows the image with its original colors. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-soft group-hover/row:opacity-50 motion-reduce:transition-none"
          />
        </div>

        <div className="flex flex-col justify-center gap-1 lg:px-8">
          <button
            type="button"
            data-showcase-open={item.id}
            aria-haspopup="dialog"
            onClick={(event) => onOpen(item.id, event.currentTarget)}
            className="w-fit cursor-pointer text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            <span
              data-showcase-title
              className="block font-display text-2xl leading-tight font-medium sm:text-3xl"
            >
              {item.title}
            </span>
          </button>
          <span data-showcase-meta className="text-sm text-muted">
            {item.category}
          </span>
          <a
            data-showcase-meta
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative z-10 w-fit ${textLinkClass}`}
          >
            <span className={textLinkLabelClass}>{labels.visit}</span>
            <ArrowIcon className={textLinkArrowClass} />
            <span className="sr-only">{labels.newTab}</span>
          </a>
        </div>
      </div>
    </li>
  );
}
