// The site's theme is the browser's preference (prefers-color-scheme) until the visitor picks one with
// the toggle. The pick is saved in localStorage and applied as `data-theme="light" | "dark"` on <html>;
// the CSS in app/globals.css gives that attribute priority over the media query. Without a pick there
// is no attribute, so the page follows the browser even without JavaScript.

export type Theme = "light" | "dark";

const storageKey = "theme";
const darkQuery = "(prefers-color-scheme: dark)";

// Runs in <head> before the first paint, so a saved pick never flashes the other theme. Keep the key
// and the attribute in sync with the code below.
export const themeInitScript = `try{var t=localStorage.getItem("${storageKey}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** Puts the saved pick back on <html>. A locale switch remounts <html> and drops the attribute. */
export function applyStoredTheme() {
  const stored = readStoredTheme();
  if (stored) document.documentElement.dataset.theme = stored;
}

/** The theme on screen: the visitor's pick, else the browser's preference. */
export function getTheme(): Theme {
  const picked = document.documentElement.dataset.theme;
  if (picked === "light" || picked === "dark") return picked;
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  // Colour transitions on individual elements would run out of step with each other, and would be
  // caught half-way by a view transition's snapshot; switch them off for the change.
  const guard = document.createElement("style");
  guard.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.append(guard);

  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {}

  // Force styles to apply with the guard in place, then lift it after the change has painted.
  void getComputedStyle(document.body).opacity;
  requestAnimationFrame(() => requestAnimationFrame(() => guard.remove()));
}

/** Calls `onChange` when the pick changes or, while there is no pick, when the browser preference does. */
export function subscribeTheme(onChange: () => void) {
  const query = window.matchMedia(darkQuery);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  query.addEventListener("change", onChange);

  return () => {
    observer.disconnect();
    query.removeEventListener("change", onChange);
  };
}
