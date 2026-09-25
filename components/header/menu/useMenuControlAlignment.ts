"use client";

import { useEffect, type RefObject } from "react";

// The real header's control dock (`#header-controls` in Header.tsx) and this row are both `fixed`,
// both `max-w-7xl px-6 sm:px-8`, both right-aligned — on paper the same box, so they "should" land on
// the same pixel with no JS at all. The hero/menu-body alignment bug (see useMenuHomeAlignment) already
// proved that assumption wrong once for a reason nobody found, so this measures instead of trusting it
// again. Runs on every page (unlike useMenuHomeAlignment, which only matches the hero on the home page),
// because the header itself exists everywhere.
export function useMenuControlAlignment({
  open,
  controlRowRef,
}: Readonly<{
  open: boolean;
  controlRowRef: RefObject<HTMLDivElement | null>;
}>) {
  useEffect(() => {
    const controlRow = controlRowRef.current;
    if (!controlRow) return;

    if (!open) {
      // Same 700ms as the overlay's own clip-path transition (see Menu.tsx): dropping the correction
      // right away would snap the dock to its untouched position while still visible closing.
      const timer = window.setTimeout(() => {
        controlRow.style.transform = "";
      }, 700);
      return () => window.clearTimeout(timer);
    }

    const sync = () => {
      const headerControls = document.getElementById("header-controls");
      // The row's only child is <ControlDock>: measuring it (not the row, whose own box still
      // includes its right padding) is what makes this comparable to `#header-controls` below.
      const dock = controlRow.firstElementChild;
      if (!headerControls || !dock) return;

      // Cleared before measuring, so a previous run's shift is never baked into this one's delta.
      controlRow.style.transform = "";
      const headerRect = headerControls.getBoundingClientRect();
      const dockRect = dock.getBoundingClientRect();
      // Both docks are right-aligned content, so matching the right edges is what keeps them still.
      controlRow.style.transform = `translateX(${headerRect.right - dockRect.right}px)`;
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [open, controlRowRef]);
}
