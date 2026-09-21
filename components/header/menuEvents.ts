// Lets a button outside the header (the in-page "back to menu" arrow) open the menu overlay, whose
// open state lives inside <Menu />.
export const OPEN_MENU_EVENT = "open-menu";

// Where the in-page back arrow leads: the home when the page was reached from a link on the home
// (the hero's), the menu otherwise, since the menu is how every other page is reached.
export const backTarget = { toHome: false };

// True when the last page change came from a link inside the menu: the overlay is still closing over the
// new page, so the home waits for it before its own fade-in (otherwise the fade plays behind the overlay).
export const cameFromMenu = { current: false };
// How long the home waits, after the menu starts closing, before its first row rises. The overlay's ease is
// front-loaded (most of the wipe is done in the first 300 ms), so a long wait only leaves the page empty.
export const MENU_CLOSE_WAIT_MS = 0;

// The overlay's own reveal transition (Menu.tsx, `duration-700`), in both directions.
export const MENU_REVEAL_MS = 700;

// Fired on window each time the menu opens or closes, with `{ open }` as the detail. The home listens
// so it can leave its content out while the overlay covers it (see Hero.tsx).
export const MENU_STATE_EVENT = "menu-state";
