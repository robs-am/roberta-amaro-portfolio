import type { Ref } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  textLinkArrowClass,
  textLinkClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { ProjectImages } from "./ProjectImages";
import { focusRing } from "./styles";
import type { ShowcaseItem, ShowcaseLabels } from "./types";

/** What the lightbox card shows for one project: the screenshot, then its text. */
export function ProjectDetails({
  item,
  labels,
  contentRef,
  onClose,
}: Readonly<{
  item: ShowcaseItem;
  labels: ShowcaseLabels;
  contentRef: Ref<HTMLDivElement>;
  onClose: () => void;
}>) {
  return (
    <div ref={contentRef} className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* Every image gets the same frame so the lightbox has one height for all projects and
          never needs to scroll on desktop; the screenshot is cropped to fit it. */}
      <div className="relative aspect-16/10 bg-elevated">
        <ProjectImages images={item.images} sizes="(min-width: 1024px) 44rem, 100vw" />
      </div>
      <p aria-live="polite" className="sr-only">
        {item.title}
      </p>
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium sm:text-4xl">
              {item.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{item.category}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 cursor-pointer rounded-sm text-base font-medium text-accent underline-offset-4 hover:underline ${focusRing}`}
          >
            {labels.close}
          </button>
        </div>

        <p className="text-base leading-7">{item.description}</p>
        {item.contribution && (
          <p className="text-base leading-7 text-muted">
            <span className="sr-only">{labels.whatIDid}: </span>
            {item.contribution}
          </p>
        )}
        {item.tech.length > 0 && (
          <p aria-label={labels.tech} className="text-base leading-7 font-medium text-accent">
            {item.tech.join(", ")}
          </p>
        )}

        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto self-start ${textLinkClass}`}
        >
          <span className={textLinkLabelClass}>{labels.visit}</span>
          <ArrowIcon className={textLinkArrowClass} />
          <span className="sr-only">{labels.newTab}</span>
        </a>
      </div>
    </div>
  );
}
