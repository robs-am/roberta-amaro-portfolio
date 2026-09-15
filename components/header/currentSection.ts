// Order matters: the last section whose top has scrolled past the viewport's top edge wins.
const SECTION_IDS = ["hero", "experience", "projects"];

/**
 * Hash for whichever section is currently on screen, computed from actual scroll position
 * rather than `window.location.hash` — that only changes on an anchor click
 * (see `smoothScroll.ts`), so it goes stale the moment someone scrolls by wheel/touch instead.
 */
export function currentSectionHash(): string {
  let hash = "";

  for (const id of SECTION_IDS) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= 1) {
      hash = `#${id}`;
    }
  }

  return hash;
}
