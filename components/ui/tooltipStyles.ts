// Visual label for icon-only controls (they already have an aria-label, so the label is hidden from assistive tech).
// The control is `relative` and carries the group named in the class (`group/link` or `group/tip`); the label shows on
// hover and on keyboard focus, and fades with the reduced-motion preference.
const tooltipBase =
  "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-200 motion-reduce:transition-none";

// Above the control (the hero's icons, in the middle of the page).
export const tooltipAboveClass = `${tooltipBase} bottom-full mb-1 group-hover/link:opacity-100 group-focus-visible/link:opacity-100`;

// Below the control (the header's, at the top of the page, where there is no room above).
export const tooltipBelowClass = `${tooltipBase} top-full mt-2 z-10 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100`;
