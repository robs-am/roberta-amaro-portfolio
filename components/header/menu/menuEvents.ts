// Fired when the menu closes back onto the home page without a route change (close button, Escape,
// or picking "Home" while already there) — never on an actual navigation. Lets the hero (already
// mounted underneath) replay its own items' entrance instead of just sitting there as the overlay lifts.
export const HERO_REENTER_EVENT = "hero-reenter";

// Set by the hero's links while its text drifts out, and consumed by the page that opens (see PageEnter): that page
// then fades in, so the change is not a hard cut. One shot, so no other navigation picks it up.
export const heroNavigation = { pending: false };
