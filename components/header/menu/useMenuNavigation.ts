"use client";

import { useEffect, useState } from "react";
import { backTarget } from "./menuEvents";

// A nav link only closes the menu once the router has actually landed on its route: closing on the
// click itself reveals whatever page the menu was opened on for the last stretch of navigation, which
// briefly shows that old page before the new one swaps in. `pendingHref` also lets the 3D layer freeze
// as soon as navigation starts (see MenuShapes), instead of animating through the whole close transition
// while the heavier destination route is mounting.
export function useMenuNavigation({
  open,
  setOpen,
  pathname,
}: Readonly<{ open: boolean; setOpen: (open: boolean) => void; pathname: string }>) {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Genuine synchronization with an external system (the router's pathname), not a derived render
  // value — the "adjust state during render" alternative needs a ref to compare against the previous
  // pathname, which this project's stricter (React Compiler) lint rules disallow just as much.
  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingHref(null);
    }
  }, [pathname, pendingHref, setOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) setPendingHref(null);
  }, [open]);

  const navigate = (href: string) => {
    backTarget.toHome = false;
    if (href === pathname) setOpen(false);
    else setPendingHref(href);
  };

  return { pendingHref, navigate };
}
