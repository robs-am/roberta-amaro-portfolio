"use client";

import { useTranslations } from "next-intl";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { textLinkArrowLargeClass, textLinkLabelClass, textLinkLargeClass } from "@/components/ui/textLinkStyles";
import { useContactLinks } from "@/components/layout/useContactLinks";
import { menuRowEnter } from "./menuEnter";
import { navItems } from "./navItems";

export function MenuContacts({ open }: Readonly<{ open: boolean }>) {
  const tHero = useTranslations("Hero");
  const contacts = useContactLinks();

  if (contacts.length === 0) return null;

  // Continues the nav list's stagger (see menuRowEnter) as its last row.
  const { className, style } = menuRowEnter(open, navItems.length);

  return (
    <ul
      className={`menu-contacts flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-10 ${className}`}
      style={style}
    >
      {contacts.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            aria-label={link.external ? `${link.label} ${tHero("newTab")}` : link.label}
            className={textLinkLargeClass}
          >
            <ArrowIcon className={textLinkArrowLargeClass} />
            <span className={textLinkLabelClass}>{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
