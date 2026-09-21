"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

// The home page is only the hero, which already carries the contacts and links; the header keeps
// just the language and theme controls there (see HeaderShell).
export function HideOnHome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  return pathname === "/" ? null : children;
}
