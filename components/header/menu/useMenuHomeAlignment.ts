"use client";

import { useEffect, type RefObject } from "react";

// On the home page (sm and up), the list's top is measured to match the hero name's top, instead of
// trusting two independently-centered boxes (of different content heights) to land on the same place.
// On any other page, or on a phone (where `max-sm:justify-start` already takes over), it is left alone.
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
    if (!open || pathname !== "/") return;
    const menuBody = menuBodyRef.current;
    const controlRow = controlRowRef.current;
    if (!menuBody || !controlRow) return;

    const sync = () => {
      if (!window.matchMedia("(min-width: 40rem)").matches) {
        menuBody.style.paddingTop = "";
        menuBody.style.justifyContent = "";
        return;
      }
      const heroTitle = document.querySelector<HTMLElement>("#hero h1");
      if (!heroTitle) return;
      const offset = heroTitle.getBoundingClientRect().top - controlRow.getBoundingClientRect().bottom;
      menuBody.style.justifyContent = "flex-start";
      menuBody.style.paddingTop = `${Math.max(offset, 0)}px`;
    };

    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      menuBody.style.paddingTop = "";
      menuBody.style.justifyContent = "";
    };
  }, [open, pathname, menuBodyRef, controlRowRef]);
}
