"use client";

import { useTranslations } from "next-intl";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/ContactIcons";
import { onSmoothAnchorClick } from "@/components/header/smoothScroll";
import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

const linkClass =
  "inline-flex size-14 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  return (
    <section
      id="hero"
      className="hero-reveal snap-start flex h-[calc(100dvh-var(--header-height,0px))] flex-col justify-center scroll-mt-(--header-height,0px) pb-16 sm:pb-20 lg:pb-28"
    >
      <h1 className="text-6xl font-bold lg:text-8xl">
        {profile.name}
      </h1>
      <div aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-accent" />
      <p className="mt-3 text-sm font-semibold tracking-wide text-foreground uppercase">
        {localize(profile.role, locale)}
      </p>
      <p className="mt-8 max-w-2xl text-pretty leading-7 text-foreground/90">
        {localize(profile.bio, locale)}
      </p>
      <p className="mt-2 max-w-2xl text-pretty leading-7 text-foreground/90">
        {localize(profile.focus, locale)}{" "}
        {profile.interests.map((interest, index) => (
          <span key={localize(interest, locale)}>
            {index > 0 && (index === profile.interests.length - 1 ? ` ${t("and")} ` : ", ")}
            <span className="font-semibold text-highlight">{localize(interest, locale)}</span>
          </span>
        ))}
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#experience" onClick={onSmoothAnchorClick} className={ctaClass}>
          {t("experienceCta")}
          <ArrowIcon />
        </a>
        <a href="#projects" onClick={onSmoothAnchorClick} className={ctaClass}>
          {t("projectsCta")}
          <ArrowIcon />
        </a>
      </div>
      {links.length > 0 && (
        <ul className="mt-8 flex gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                className={linkClass}
              >
                <link.Icon />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}
