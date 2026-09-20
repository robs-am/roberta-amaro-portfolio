"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useHeaderScrolled } from "./HeaderScrollContext";
import { navItems } from "./navItems";

export function DesktopNav({
  navLabel,
  labels,
}: Readonly<{
  navLabel: string;
  labels: Record<(typeof navItems)[number]["key"], string>;
}>) {
  const scrolled = useHeaderScrolled();
  const pathname = usePathname();

  const inactiveClass = scrolled ? "text-muted hover:text-foreground" : "text-foreground/90 hover:text-foreground";

  return (
    <nav aria-label={navLabel} className="hidden md:block">
      <ul className="flex gap-2 text-base font-medium">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "bg-accent/10 text-foreground" : inactiveClass
                }`}
              >
                {labels[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
