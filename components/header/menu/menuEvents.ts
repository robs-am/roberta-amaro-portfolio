// Lets a button outside the header (the in-page "back to menu" arrow) open the menu overlay, whose
// open state lives inside <Menu />.
export const OPEN_MENU_EVENT = "open-menu";

// Fired when the menu closes back onto the home page without a route change (close button, Escape,
// or picking "Home" while already there) — never on an actual navigation. Lets the hero (already
// mounted underneath) replay its own items' entrance instead of just sitting there as the overlay lifts.
export const HERO_REENTER_EVENT = "hero-reenter";

// Where the in-page back arrow leads: the home when the page was reached from a link on the home
// (the hero's), the menu otherwise, since the menu is how every other page is reached.
export const backTarget = { toHome: false };
