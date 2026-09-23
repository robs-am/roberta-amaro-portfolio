import { ProjectImages } from "./ProjectImages";
import { focusRing } from "./styles";
import type { ShowcaseItem } from "./types";

/** One row of the projects list: a button that opens the lightbox for its project. */
export function ProjectRow({
  item,
  onOpen,
}: Readonly<{ item: ShowcaseItem; onOpen: (id: string, trigger: HTMLElement) => void }>) {
  return (
    <li data-showcase-item className="border-b border-border lg:py-4">
      <button
        type="button"
        data-showcase-open={item.id}
        aria-haspopup="dialog"
        onClick={(event) => onOpen(item.id, event.currentTarget)}
        className={`group grid w-full cursor-pointer text-left lg:h-28 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] ${focusRing}`}
      >
        <span className="flex flex-col justify-center gap-1 py-6 lg:order-2 lg:px-8 lg:py-0">
          <span
            data-showcase-title
            className="font-display text-2xl leading-tight font-medium sm:text-3xl"
          >
            {item.title}
          </span>
          <span data-showcase-meta className="text-sm text-muted">
            {item.category}
          </span>
        </span>
        <span
          data-showcase-image
          className="relative mb-6 block aspect-video overflow-hidden rounded-xl bg-elevated lg:order-1 lg:mb-0 lg:aspect-auto lg:rounded-lg lg:rounded-tr-[3rem]"
        >
          <span className="absolute inset-0 block transition-transform duration-700 ease-soft group-hover:scale-105 motion-reduce:transition-none">
            <ProjectImages images={item.images} sizes="(min-width: 1024px) 60vw, 100vw" />
          </span>
          {/* Evens out the very different screenshots on the page; lifts on hover, and the
              lightbox shows the image with its original colors. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-soft group-hover:opacity-50 motion-reduce:transition-none"
          />
        </span>
      </button>
    </li>
  );
}
