"use client";

import Image from "next/image";
import { useState } from "react";

export type ShowcaseImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  href: string;
  images: ShowcaseImage[];
  description: string;
  contribution?: string;
  tech: string[];
};

export type ShowcaseLabels = {
  visit: string;
  newTab: string;
  tech: string;
  whatIDid: string;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function ProjectShowcase({
  items,
  labels,
}: Readonly<{ items: ShowcaseItem[]; labels: ShowcaseLabels }>) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Desktop preview: every project's panel is stacked and only the active one is visible, so
          switching is a cross-fade instead of a remount. Hidden below lg, where each row carries
          its own image instead (hover doesn't exist on touch). */}
      <div className="relative hidden lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-tr-[6rem] rounded-bl-xl bg-elevated">
            {items.map((item) => {
              const active = item.id === activeId;
              return (
                <div
                  key={item.id}
                  aria-hidden={!active}
                  className={`absolute inset-0 transition-opacity duration-500 ease-soft motion-reduce:transition-none ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ProjectImages images={item.images} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
              );
            })}
          </div>
          {/* Caption for the active project; sits under the frame so the frame never moves. */}
          {activeItem && (
            <div key={activeItem.id} className="mt-6 max-w-[60ch] space-y-3 text-base leading-7">
              <p className="text-muted">{activeItem.description}</p>
              {activeItem.contribution && (
                <p className="text-foreground">
                  <span className="sr-only">{labels.whatIDid}: </span>
                  {activeItem.contribution}
                </p>
              )}
              {activeItem.tech.length > 0 && (
                <p aria-label={labels.tech} className="font-medium text-accent">
                  {activeItem.tech.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <ul className="border-t border-border">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="border-b border-border">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                className={`group flex items-baseline justify-between gap-6 py-6 transition-colors duration-300 ease-soft ${focusRing} ${
                  active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                <span className="font-display text-2xl font-medium sm:text-3xl">
                  {item.title}
                  <span className="sr-only"> {labels.newTab}</span>
                </span>
                {/* Category and call-to-action share one grid cell: on hover/focus the category
                    fades out and "visit" fades in with its line growing. Touch never hovers, so
                    there the category just stays. */}
                <span className="grid shrink-0 justify-items-end text-sm">
                  <span className="col-start-1 row-start-1 text-muted transition-opacity duration-300 ease-soft group-hover:opacity-0 group-focus-visible:opacity-0">
                    {item.category}
                  </span>
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 flex items-center gap-3 text-foreground opacity-0 transition-opacity duration-300 ease-soft group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {labels.visit}
                    <span className="h-px w-0 bg-current transition-[width] duration-500 ease-expressive group-hover:w-8 group-focus-visible:w-8 motion-reduce:transition-none" />
                  </span>
                </span>
              </a>
              <div className="pb-6 lg:hidden">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-elevated">
                  <ProjectImages images={item.images} sizes="100vw" />
                </div>
                <p className="mt-4 text-base leading-7 text-muted">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** One screenshot fills the frame; several become the diagonal slices (same shape as before). */
function ProjectImages({
  images,
  sizes,
}: Readonly<{ images: ShowcaseImage[]; sizes: string }>) {
  if (images.length === 0) return <div aria-hidden="true" className="project-panel h-full w-full" />;

  if (images.length === 1) {
    const [image] = images;
    return (
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes}
        className="h-full w-full object-cover object-top"
      />
    );
  }

  return (
    <div className="flex h-full w-full">
      {images.map((image) => (
        <div key={image.src} className="project-slice min-w-0 flex-1 overflow-hidden">
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes={sizes}
            className="h-full w-full object-cover object-[30%_50%]"
          />
        </div>
      ))}
    </div>
  );
}
