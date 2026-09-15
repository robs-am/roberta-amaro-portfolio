"use client";

import { useTranslations } from "next-intl";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/ContactIcons";
import { profile } from "@/data/profile";

const linkClass =
  "inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ContactLinks({ className }: { className?: string }) {
  const t = useTranslations("Hero");

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  if (links.length === 0) return null;

  return (
    <ul className={`items-center gap-2 ${className ?? ""}`}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
            className={linkClass}
          >
            <link.Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
