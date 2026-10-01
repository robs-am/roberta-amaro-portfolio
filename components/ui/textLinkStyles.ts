// Text-only link: the underline is a background gradient that grows from the left on hover/focus.
// Apply `textLinkClass` to the link, `textLinkLabelClass` to its label and `textLinkArrowClass` to its arrow.
export const textLinkClass =
  "group inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-accent dark:text-foreground dark:hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export const textLinkLabelClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-expressive group-hover:bg-[length:100%_1.5px] group-focus-visible:bg-[length:100%_1.5px]";

export const textLinkArrowClass =
  "size-4 shrink-0 transition-transform duration-300 ease-expressive motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5";

// Light text for what sits on the dark wine front wave of the light theme (the menu's contacts and the
// credits). Only on landscape screens: on a portrait one the waves are faint (see `PORTRAIT_ASPECT` in
// waveLayers.ts, 0.85 = 17/20), and light text would vanish on the pale page. The dark theme is already light.
// A greyed blue-white, not white or pink: white was too stark against the waves and pink too sweet. Important so it
// wins over the base colour of whatever it is added to (the credits' `text-foreground/85`).
export const onWaveTextClass = "[@media(min-aspect-ratio:17/20)]:text-[#e0e4ec]!";

// Larger variant, for links that sit next to big type (the hero and the menu's contact links). Large from
// the smallest screen (not just from `sm`): on the menu these sit under giant nav type, where the base
// 16px link read as an afterthought next to it.
export const textLinkLargeClass = textLinkClass.replace("text-base", "text-xl lg:text-2xl");
export const textLinkArrowLargeClass = textLinkArrowClass.replace("size-4", "size-5 lg:size-6");

// The hero's calls to action: large from the smallest screen, since on a phone they are stacked and
// are the main thing to tap. On a phone the size follows the width, to fill the line like the name does;
// kept close to the role text's size (just above it) rather than ballooning past it.
export const textLinkHeroClass = textLinkClass.replace(
  "text-base",
  "text-[clamp(1.25rem,5.5vw,1.5rem)] sm:text-[1.375rem] lg:text-2xl",
);
export const textLinkArrowHeroClass = textLinkArrowClass.replace("size-4", "size-6 sm:size-5 lg:size-6");

// Emphasised variant of the label: the underline is always drawn instead of growing on hover.
export const textLinkLabelActiveClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1.5px] bg-left-bottom bg-no-repeat pb-0.5";
