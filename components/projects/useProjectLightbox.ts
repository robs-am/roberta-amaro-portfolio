import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { ShowcaseItem } from "./types";

// The lightbox's card grows out of the clicked row and shrinks back into it: its clip-path is
// the row's rectangle and corner radii, expressed in the card's coordinates, animated to the
// card's full box and its own corners (top-right 4rem, bottom-left 0.75rem).
const PANEL_CLIP = "inset(0px 0px 0px 0px round 0px 64px 0px 12px)";

const prefersMotion = () =>
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

function rowClip(panel: HTMLElement, trigger: HTMLElement | null): string {
  // The row's visible shape is its image (the text sits straight on the page), so that's what
  // the card grows out of.
  const row = trigger?.closest("li")?.querySelector<HTMLElement>("[data-showcase-image]");
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

/**
 * Open/close/previous/next state and animations for the project lightbox. The rows live under
 * `rootRef` (each with `data-showcase-open="<id>"`); the returned refs go on the dialog, on its
 * visible card and on the card's content.
 */
export function useProjectLightbox(items: ShowcaseItem[], rootRef: RefObject<HTMLElement | null>) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = items.findIndex((item) => item.id === openId);
  const openItem: ShowcaseItem | undefined = items[openIndex];
  const isOpen = openId !== null;

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
    if (prefersMotion()) {
      animations.push(
        animate(panel, {
          clipPath: [rowClip(panel, trigger.current), PANEL_CLIP],
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

  function open(id: string, element: HTMLElement) {
    trigger.current = element;
    setOpenId(id);
  }

  // Previous/next swap the project inside the open dialog (it doesn't reopen), wrapping around at
  // the ends. The close animation then shrinks back into the row of the project being shown.
  // The content slides a little and fades out the way it's leaving, the new project comes in from
  // the other side (see the effect above); presses during the swap are ignored.
  function step(direction: 1 | -1) {
    const content = contentRef.current;
    if (closing.current || swapping.current || !content || items.length < 2) return;
    const next = items[(openIndex + direction + items.length) % items.length];
    trigger.current =
      rootRef.current?.querySelector<HTMLElement>(`[data-showcase-open="${next.id}"]`) ?? null;

    if (!prefersMotion()) {
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
    if (!prefersMotion()) {
      finish();
      return;
    }

    dialog.dataset.closing = "";
    // Shrink into the row, then fade out over the last stretch: the row underneath takes over
    // from the dialog's content without a jump.
    animate(panel, {
      clipPath: [PANEL_CLIP, rowClip(panel, trigger.current)],
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

  return { openItem, dialogRef, panelRef, contentRef, open, step, requestClose };
}
