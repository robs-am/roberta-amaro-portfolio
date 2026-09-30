import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { Link } from "@/i18n/navigation";
import { ProjectImages } from "./ProjectImages";
import type { ShowcaseItem, ShowcaseLabels } from "./types";

const titleTriggerClass =
  "w-fit after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent";

/**
 * One card of the projects grid. The title is the button that opens the lightbox (or, for a project
 * with its own page, the link to it); its `::after` stretches over the whole card so the image
 * opens it too, and the "visit site" link sits above that layer (a link can't live inside the
 * button, and it must not open the lightbox).
 */
export function ProjectCard({
  item,
  labels,
  onOpen,
  priority = false,
}: Readonly<{
  item: ShowcaseItem;
  labels: Pick<ShowcaseLabels, "visit" | "newTab" | "viewCase">;
  onOpen: (id: string, trigger: HTMLElement) => void;
  priority?: boolean;
}>) {
  const title = (
    <span
      data-showcase-title
      className="block font-display text-xl leading-tight font-medium sm:text-2xl"
    >
      {item.title}
    </span>
  );

  return (
    <li
      data-showcase-item
      className="group/card relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-500 ease-soft hover:border-muted motion-reduce:transition-none"
    >
      <div data-showcase-image className="relative aspect-video overflow-hidden bg-elevated">
        <span className="absolute inset-0 block transition-transform duration-700 ease-soft group-hover/card:scale-105 motion-reduce:transition-none">
          <ProjectImages
            images={item.images}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw"
            priority={priority}
          />
        </span>
        {/* Evens out the very different screenshots on the page; lifts on hover, and the
            lightbox shows the image with its original colors. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-soft group-hover/card:opacity-50 motion-reduce:transition-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {item.caseHref ? (
          title
        ) : (
          <button
            type="button"
            data-showcase-open={item.id}
            aria-haspopup="dialog"
            onClick={(event) => onOpen(item.id, event.currentTarget)}
            className={`cursor-pointer text-left ${titleTriggerClass}`}
          >
            {title}
          </button>
        )}

        <p data-showcase-meta className="text-base leading-7 text-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <span
            data-showcase-meta
            className="rounded-full border border-border px-3 py-1 text-sm text-muted"
          >
            {item.category}
          </span>
          {item.caseHref ? (
            // The link to the case; its `::after` covers the whole card, like the lightbox button. The
            // site link lives on the case page, so the case is what a visitor reaches first.
            <Link
              data-showcase-meta
              href={item.caseHref}
              className={`inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent dark:text-foreground ${titleTriggerClass}`}
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-expressive group-hover/card:bg-[length:100%_1.5px] group-focus-within/card:bg-[length:100%_1.5px] motion-reduce:transition-none">
                {labels.viewCase}
              </span>
              <svg
                viewBox="0 0 16 16"
                className="size-4 shrink-0 transition-transform duration-300 ease-expressive motion-safe:group-hover/card:translate-x-0.5"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
              <span className="sr-only">: {item.title}</span>
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </li>
  );
}
