// Text-only link: the underline is a background gradient that grows from the left on hover/focus.
// Apply `textLinkClass` to the link, `textLinkLabelClass` to its label and `textLinkArrowClass` to its arrow.
export const textLinkClass =
  "group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent dark:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export const textLinkLabelClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-expressive group-hover:bg-[length:100%_1.5px] group-focus-visible:bg-[length:100%_1.5px]";

export const textLinkArrowClass =
  "size-4 shrink-0 transition-transform duration-300 ease-expressive motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5";

// Larger variant, for links that sit next to big type (the hero and the menu's contact links).
export const textLinkLargeClass = textLinkClass.replace("text-base", "text-base sm:text-xl lg:text-2xl");
export const textLinkArrowLargeClass = textLinkArrowClass.replace("size-4", "size-4 sm:size-5 lg:size-6");

// The hero's calls to action: large from the smallest screen, since on a phone they are stacked and
// are the main thing to tap.
export const textLinkHeroClass = textLinkClass.replace("text-base", "text-xl lg:text-2xl");
export const textLinkArrowHeroClass = textLinkArrowClass.replace("size-4", "size-5 lg:size-6");

// Emphasised variant of the label: the underline is always drawn instead of growing on hover.
export const textLinkLabelActiveClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1.5px] bg-left-bottom bg-no-repeat pb-0.5";
