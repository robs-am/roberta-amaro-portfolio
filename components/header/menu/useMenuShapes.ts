"use client";

import { useCallback, useEffect, useState } from "react";
import { OPEN_MENU_EVENT } from "./menuEvents";

// Matches the overlay's `duration-700` reveal transition.
const CLOSE_DURATION_MS = 700;

// Owns the 3D layer's lifecycle: it exists only while the menu is visible, mounted a frame after the
// open transition starts (not in the same tick — building the WebGL context and compiling shaders
// right when the clip-path transition kicks off competes with it for the main thread and makes the
// opening animation stutter) and torn down once the close transition has finished, so it does not keep
// a WebGL context alive on every page.
export function useMenuShapes(open: boolean, setOpen: (open: boolean) => void) {
  const [shapesMounted, setShapesMounted] = useState(false);

  const openMenu = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => setShapesMounted(true));
  }, [setOpen]);

  // The in-page back arrow (see BackButton) reopens the menu from outside the header.
  useEffect(() => {
    window.addEventListener(OPEN_MENU_EVENT, openMenu);
    return () => window.removeEventListener(OPEN_MENU_EVENT, openMenu);
  }, [openMenu]);

  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setShapesMounted(false), CLOSE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  return { shapesMounted, openMenu };
}
