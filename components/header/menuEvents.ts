// Lets a button outside the header (the in-page "back to menu" arrow) open the menu overlay, whose
// open state lives inside <Menu />.
export const OPEN_MENU_EVENT = "open-menu";

// Where the in-page back arrow leads: the home when the page was reached from a link on the home
// (the hero's), the menu otherwise, since the menu is how every other page is reached.
export const backTarget = { toHome: false };

// True when the last page change came from a link inside the menu: the overlay is still closing over the
// new page, so the home waits for it before its own fade-in (otherwise the fade plays behind the overlay).
export const cameFromMenu = { current: false };
// How long the overlay takes to be gone, enough for the page to be seen.
export const MENU_CLOSE_WAIT_MS = 500;
