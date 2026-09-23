"use client";

import { animate, type JSAnimation } from "animejs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ShowcaseImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  focus?: string;
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
  close: string;
  previous: string;
  next: string;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function ProjectShowcase({
  title,
  intro,
  items,
  labels,
}: Readonly<{ title: string; intro?: string; items: ShowcaseItem[]; labels: ShowcaseLabels }>) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = items.findIndex((item) => item.id === openId);
  const openItem = items[openIndex];
  const isOpen = openId !== null;

  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  // Set from the moment a previous/next press starts fading the content out until the new
  // project has finished fading in. `swapDirection` tells that fade-in which way to come from.
  const swapping = useRef(false);
  const swapDirection = useRef<1 | -1>(1);
  const swapAnimations = useRef<JSAnimation[]>([]);

  // Same entrance as the experience list: each row enters once, when it scrolls into view. Its
  // title is wiped in from the left, then its category fades up. CSS hides them only until this
  // runs (see `[data-showcase]` in globals.css), with a fallback that shows them anyway. Reduced
  // motion never hides them, so there is nothing to do.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const targets = root.querySelectorAll<HTMLElement>(
      "[data-showcase-title], [data-showcase-meta]",
    );
    for (const element of targets) element.style.opacity = "0";
    root.dataset.ready = "";

    const animations: JSAnimation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);

          const headings = entry.target.querySelectorAll<HTMLElement>("[data-showcase-title]");
          const meta = entry.target.querySelectorAll<HTMLElement>("[data-showcase-meta]");
          animations.push(
            animate(headings, {
              opacity: [0, 1],
              clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
              translateX: [-24, 0],
              duration: 1200,
              ease: "outExpo",
            }),
            animate(meta, {
              opacity: [0, 1],
              translateY: [16, 0],
              duration: 900,
              delay: 400,
              ease: "outExpo",
            }),
          );
        }
      },
      { threshold: 0.3 },
    );
    for (const item of root.querySelectorAll("[data-showcase-item]")) observer.observe(item);

    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, []);

  // The lightbox's card grows out of the clicked row and shrinks back into it: its clip-path is
  // the row's rectangle and corner radii, expressed in the card's coordinates, animated to the
  // card's full box and its own corners (top-right 4rem, bottom-left 0.75rem).
  const PANEL_CLIP = "inset(0px 0px 0px 0px round 0px 64px 0px 12px)";

  function rowClip(panel: HTMLElement): string {
    // The row's visible shape is its image (the text sits straight on the page), so that's what
    // the card grows out of.
    const row = trigger.current?.querySelector<HTMLElement>("[data-showcase-image]");
    if (!row) return PANEL_CLIP;
    const box = panel.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    const style = getComputedStyle(row);
    const radii = [
      style.borderTopLeftRadius,
      style.borderTopRightRadius,
      style.borderBottomRightRadius,
      style.borderBottomLeftRadius,
    ].join(" ");
    const top = rect.top - box.top;
    const right = box.right - rect.right;
    const bottom = box.bottom - rect.bottom;
    const left = rect.left - box.left;
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radii})`;
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel || !isOpen) return;

    closing.current = false;
    swapping.current = false;
    delete dialog.dataset.closing;
    dialog.showModal();
    // Lock the page's scroll without its scrollbar vanishing (which would shift everything, rows
    // included, by the scrollbar's width): the gutter stays reserved while overflow is hidden.
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";

    // The clip is a window onto the card's content, not a copy of the row, so the dialog also
    // fades in over the first moments to hide the switch from the row's own pixels.
    const animations: JSAnimation[] = [];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      animations.push(
        animate(panel, {
          clipPath: [rowClip(panel), PANEL_CLIP],
          duration: 900,
          ease: "outExpo",
          onComplete: () => {
            panel.style.clipPath = "";
          },
        }),
        animate(dialog, { opacity: [0, 1], duration: 250, ease: "outQuad" }),
      );
    }

    return () => {
      for (const animation of animations) animation.cancel();
      for (const animation of swapAnimations.current) animation.cancel();
      swapAnimations.current = [];
      panel.style.clipPath = "";
      dialog.style.opacity = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, [isOpen]);

  function open(id: string, element: HTMLElement) {
    trigger.current = element;
    setOpenId(id);
  }

  // Previous/next swap the project inside the open dialog (it doesn't reopen), wrapping around at
  // the ends. The close animation then shrinks back into the row of the project being shown.
  // The content slides a little and fades out the way it's leaving, the new project comes in from
  // the other side (see the effect below); presses during the swap are ignored.
  function step(direction: 1 | -1) {
    const content = contentRef.current;
    if (closing.current || swapping.current || !content || items.length < 2) return;
    const next = items[(openIndex + direction + items.length) % items.length];
    trigger.current =
      rootRef.current?.querySelector<HTMLElement>(`[data-showcase-open="${next.id}"]`) ?? null;

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      setOpenId(next.id);
      return;
    }

    swapping.current = true;
    swapDirection.current = direction;
    swapAnimations.current = [
      animate(content, {
        opacity: [1, 0],
        translateX: [0, -direction * 32],
        duration: 220,
        ease: "inQuad",
        onComplete: () => {
          if (closing.current) return;
          setOpenId(next.id);
        },
      }),
    ];
  }

  // Fade the newly swapped-in project in from the side the press points to. The content is still
  // at opacity 0 from the fade-out until this runs, so the swap itself is never visible.
  useEffect(() => {
    const content = contentRef.current;
    if (!content || !swapping.current) return;

    swapAnimations.current = [
      animate(content, {
        opacity: [0, 1],
        translateX: [swapDirection.current * 32, 0],
        duration: 600,
        ease: "outExpo",
        onComplete: () => {
          content.style.opacity = "";
          content.style.transform = "";
          swapping.current = false;
        },
      }),
    ];
  }, [openId]);

  function requestClose() {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel || closing.current) return;
    closing.current = true;

    const finish = () => {
      dialog.close();
      panel.style.clipPath = "";
      dialog.style.opacity = "";
      setOpenId(null);
    };
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      finish();
      return;
    }

    dialog.dataset.closing = "";
    // Shrink into the row, then fade out over the last stretch: the row underneath takes over
    // from the dialog's content without a jump.
    animate(panel, {
      clipPath: [PANEL_CLIP, rowClip(panel)],
      duration: 700,
      ease: "inOutExpo",
    });
    animate(dialog, {
      opacity: [1, 0],
      duration: 300,
      delay: 400,
      ease: "inQuad",
      onComplete: finish,
    });
  }


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
          <li key={item.id} data-showcase-item className="border-b border-border lg:py-4">
            <button
              type="button"
              data-showcase-open={item.id}
              aria-haspopup="dialog"
              onClick={(event) => open(item.id, event.currentTarget)}
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
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={openItem?.title}
        onCancel={(event) => {
          event.preventDefault();
          requestClose();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          else if (event.key === "ArrowRight") step(1);
        }}
        className="showcase-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-4 text-foreground open:grid open:place-items-center"
      >
        {/* The dialog is a transparent full-screen layer so the arrows can sit outside the card
            (anything outside a modal dialog's box can't be clicked). The card is the visible shape
            the open/close animation clips. */}
        <div className="relative flex w-full max-w-6xl flex-col gap-4 min-[56rem]:max-w-324 min-[56rem]:px-18">
          <div
            ref={panelRef}
            className="max-h-[calc(100dvh-2rem-3.75rem)] overflow-x-hidden overflow-y-auto rounded-tr-[4rem] rounded-bl-xl border border-border bg-elevated min-[56rem]:max-h-[calc(100dvh-2rem)]"
          >
            {openItem && (
              <div ref={contentRef} className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                {/* Every image gets the same frame so the lightbox has one height for all projects and
                    never needs to scroll on desktop; the screenshot is cropped to fit it. */}
                <div className="relative aspect-[16/10] bg-elevated">
                  <ProjectImages
                    images={openItem.images}
                    sizes="(min-width: 1024px) 44rem, 100vw"
                  />
                </div>
                <p aria-live="polite" className="sr-only">
                  {openItem.title}
                </p>
                <div className="flex flex-col gap-5 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl leading-tight font-medium sm:text-4xl">
                        {openItem.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted">{openItem.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={requestClose}
                      className={`shrink-0 cursor-pointer rounded-sm text-base font-medium text-accent underline-offset-4 hover:underline ${focusRing}`}
                    >
                      {labels.close}
                    </button>
                  </div>

                  <p className="text-base leading-7">{openItem.description}</p>
                  {openItem.contribution && (
                    <p className="text-base leading-7 text-muted">
                      <span className="sr-only">{labels.whatIDid}: </span>
                      {openItem.contribution}
                    </p>
                  )}
                  {openItem.tech.length > 0 && (
                    <p
                      aria-label={labels.tech}
                      className="text-base leading-7 font-medium text-accent"
                    >
                      {openItem.tech.join(", ")}
                    </p>
                  )}

                  <a
                    href={openItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group mt-auto flex w-fit items-center gap-3 rounded-sm text-base font-medium ${focusRing}`}
                  >
                    {labels.visit}
                    <span className="h-px w-6 bg-current transition-[width] duration-500 ease-expressive group-hover:w-12 motion-reduce:transition-none" />
                    <span className="sr-only">{labels.newTab}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {items.length > 1 && (
            <div className="flex justify-between min-[56rem]:pointer-events-none min-[56rem]:absolute min-[56rem]:inset-0 min-[56rem]:items-center">
              <ArrowButton direction="previous" label={labels.previous} onClick={() => step(-1)} />
              <ArrowButton direction="next" label={labels.next} onClick={() => step(1)} />
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

function ArrowButton({
  direction,
  label,
  onClick,
}: Readonly<{ direction: "previous" | "next"; label: string; onClick: () => void }>) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-elevated text-foreground transition-colors hover:text-accent ${focusRing}`}
    >
      <svg
        viewBox="0 0 16 16"
        className={`size-4 ${direction === "previous" ? "" : "-scale-x-100"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 3 5 8l5 5" />
      </svg>
    </button>
  );
}

/** One screenshot fills the frame; several become the diagonal slices (same shape as before). */
function ProjectImages({
  images,
  sizes,
}: Readonly<{ images: ShowcaseImage[]; sizes: string }>) {
  if (images.length === 0)
    return <span aria-hidden="true" className="project-panel block h-full w-full" />;

  if (images.length === 1) {
    const [image] = images;
    return (
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes}
        style={{ objectPosition: image.focus }}
        className="h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <span className="flex h-full w-full">
      {images.map((image) => (
        <span key={image.src} className="project-slice block min-w-0 flex-1 overflow-hidden">
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes={sizes}
            className="h-full w-full object-cover object-[30%_50%]"
          />
        </span>
      ))}
    </span>
  );
}
