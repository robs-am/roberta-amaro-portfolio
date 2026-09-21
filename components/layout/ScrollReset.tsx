"use client";

import { useEffect } from "react";

/**
 * Prevents browser scroll restoration on page reload and ensures the page starts at the top.
 * Disables automatic scroll restoration on history navigation and resets to top on mount.
 */
export function ScrollReset() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration behavior
    history.scrollRestoration = "manual";

    // Always start at top on page load
    window.scrollTo(0, 0);

    // If there's a hash in the URL (e.g., from a reload), remove it and ensure we stay at top.
    // The hash might cause the browser to try scrolling to an element.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
