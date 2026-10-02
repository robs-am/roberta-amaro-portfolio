"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

// The opposite of HideOnHome: what only the home page's header carries. It stays mounted and fades, because
// removing it would cut hard when the page changes. Away from the home it leaves the flow (so home/back do not
// shift for it), is not clickable and is hidden from assistive tech.
export function ShowOnHome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      inert={!isHome}
      className={`transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
        isHome ? "opacity-100" : "pointer-events-none absolute opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
