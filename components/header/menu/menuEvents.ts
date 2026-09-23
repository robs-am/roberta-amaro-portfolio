// Lets a button outside the header (the in-page "back to menu" arrow) open the menu overlay, whose
// open state lives inside <Menu />.
export const OPEN_MENU_EVENT = "open-menu";

// Where the in-page back arrow leads: the home when the page was reached from a link on the home
// (the hero's), the menu otherwise, since the menu is how every other page is reached.
export const backTarget = { toHome: false };
