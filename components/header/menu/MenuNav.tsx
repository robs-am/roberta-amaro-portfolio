"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { menuRowEnter } from "./menuEnter";
import { navItems } from "./navItems";

export function MenuNav({
  open,
  pathname,
  onNavigate,
}: Readonly<{ open: boolean; pathname: string; onNavigate: (href: string) => void }>) {
  const t = useTranslations("Header");

  return (
    <nav aria-label={t("navLabel")}>
      <ul className="flex flex-col gap-1">
        {navItems.map((item, index) => {
          const active = pathname === item.href;
          const { className, style } = menuRowEnter(open, index);

          return (
            <li key={item.href} className={`relative ${className}`} style={style}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(item.href)}
                className={`menu-nav-link inline-flex rounded-sm font-display text-[clamp(2rem,10.5vw,3rem)] leading-[1.1] font-bold tracking-wide uppercase transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-7xl lg:text-8xl ${
                  active ? "text-accent" : "text-foreground"
                }`}
              >
                {/* Absolute, not inline: the number used to push the word itself away from the link's own
                    left edge, so it no longer lined up with the hero name's "R" (see Hero.tsx). */}
                <span
                  aria-hidden="true"
                  className="absolute right-full bottom-1 mr-3 font-sans text-sm font-medium tracking-normal text-muted"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {t(`nav.${item.key}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
