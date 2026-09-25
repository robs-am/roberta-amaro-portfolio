"use client";

import { useEffect, type RefObject } from "react";

// On the home page (sm and up), the list's top and left are measured to match the hero name's,
// instead of trusting two independently-centered boxes (of different content and max-widths) to land
// in the same place — in practice they don't: the two "same" `max-w-5xl px-6` columns render dozens of
// pixels apart because one sits inside the full-bleed hero section and the other is portaled straight
// to <body>. On any other page, or on a phone (where `max-sm:justify-start` already takes over), it is
// left alone.
export function useMenuHomeAlignment({
  open,
  pathname,
  menuBodyRef,
  controlRowRef,
}: Readonly<{
  open: boolean;
  pathname: string;
  menuBodyRef: RefObject<HTMLDivElement | null>;
  controlRowRef: RefObject<HTMLDivElement | null>;
}>) {
  useEffect(() => {
    const menuBody = menuBodyRef.current;
    const controlRow = controlRowRef.current;
    if (!menuBody || !controlRow) return;

    if (!open || pathname !== "/") {
      // The overlay itself takes 700ms to clip-path away (see Menu.tsx): dropping the alignment right
      // away would snap the content back to its untouched, uncentred position while it is still visible
      // closing. Wait the same duration, so the jump happens off-screen instead.
      const timer = window.setTimeout(() => {
        menuBody.style.paddingTop = "";
        menuBody.style.justifyContent = "";
        menuBody.style.transform = "";
      }, 700);
      return () => window.clearTimeout(timer);
    }

    const sync = () => {
      if (!window.matchMedia("(min-width: 40rem)").matches) {
        menuBody.style.paddingTop = "";
        menuBody.style.justifyContent = "";
        menuBody.style.transform = "";
        return;
      }
      const heroTitle = document.querySelector<HTMLElement>("#hero h1");
      if (!heroTitle) return;

      // Cleared before measuring, so a previous run's shift is never baked into this one's delta.
      menuBody.style.transform = "";
      const heroRect = heroTitle.getBoundingClientRect();
      const menuRect = menuBody.getBoundingClientRect();
      const verticalOffset = heroRect.top - controlRow.getBoundingClientRect().bottom;

      menuBody.style.justifyContent = "flex-start";
      menuBody.style.paddingTop = `${Math.max(verticalOffset, 0)}px`;
      menuBody.style.transform = `translateX(${heroRect.left - menuRect.left}px)`;
    };

    sync();
    window.addEventListener("resize", sync);
    // No reset here: that's the `!open` branch's job, delayed to outlast the close transition. Cutting
    // it here too would beat that delay every time `open` flips, undoing the fix above.
    return () => window.removeEventListener("resize", sync);
  }, [open, pathname, menuBodyRef, controlRowRef]);
}
