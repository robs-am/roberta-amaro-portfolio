"use client";

import { useEffect, type RefObject } from "react";

// Keyboard and screen-reader trap for the menu overlay: while it's open, everything else in <body>
// goes inert, the page's own scroll is locked, focus moves to the close button, and Escape closes it.
export function useMenuDialog({
  open,
  setOpen,
  overlayRef,
  openRef,
  closeRef,
}: Readonly<{
  open: boolean;
  setOpen: (open: boolean) => void;
  overlayRef: RefObject<HTMLDivElement | null>;
  openRef: RefObject<HTMLButtonElement | null>;
  closeRef: RefObject<HTMLButtonElement | null>;
}>) {
  useEffect(() => {
    if (!open) return;
    const opener = openRef.current;

    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlayRef.current && element.tagName !== "SCRIPT",
    );
    for (const element of siblings) element.inert = true;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      for (const element of siblings) element.inert = false;
      opener?.focus();
    };
  }, [open, setOpen, overlayRef, openRef, closeRef]);
}
