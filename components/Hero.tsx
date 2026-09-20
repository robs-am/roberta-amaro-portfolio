"use client";


import { animate, stagger } from "animejs";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/ContactIcons";
import {
  textLinkArrowHeroClass,
  textLinkHeroClass,
  textLinkLabelActiveClass,
  textLinkLabelClass,
} from "@/components/textLinkStyles";
import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";

// three.js is only loaded in the browser, after the hero text, so it never delays first paint.
const HeroShapes = dynamic(() => import("@/components/HeroShapes").then((mod) => mod.HeroShapes), {
  ssr: false,
});

const linkClass =
  "group/link relative inline-flex size-16 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-accent dark:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Visual label for the icon-only links (they already have an aria-label, so it is hidden from assistive tech).
const tooltipClass =
  "pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none";

export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");
  const tFooter = useTranslations("Footer");
  const sectionRef = useRef<HTMLElement>(null);

  // Enters each `[data-hero-item]` in DOM order (name words → bar → role → text → CTAs → links).
  // CSS hides them only until this runs (see `[data-hero-item]` in globals.css), with a fallback
  // that shows them anyway. Reduced motion never hides them, so there is nothing to do.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const words = section.querySelectorAll<HTMLElement>("[data-hero-word]");
    const items = section.querySelectorAll<HTMLElement>("[data-hero-item]");
    for (const target of [...words, ...items]) target.style.opacity = "0";
    section.dataset.ready = "";

    const [first, ...rest] = words;
    const animations = [
      // First name: wiped in from the left, sliding slightly to the right as it is revealed.
      animate(first, {
        opacity: [0, 1],
        clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
        translateX: [-32, 0],
        duration: 1400,
        ease: "outExpo",
      }),
      // Following names: wiped in from the top, dropping into the same line.
      animate(rest, {
        opacity: [0, 1],
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        translateY: [-40, 0],
        duration: 1400,
        delay: stagger(250, { start: 900 }),
        ease: "outExpo",
      }),
      animate(items, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 1300,
        delay: stagger(180, { start: 1900 }),
        ease: "outExpo",
      }),
    ];

    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, []);

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-reveal relative ml-[calc(50%-50vw)] w-screen flex flex-1 flex-col justify-center overflow-x-hidden scroll-mt-(--header-height,0px)"
    >
      <HeroShapes />
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl leading-[1.05] font-bold uppercase sm:text-6xl lg:text-8xl xl:text-9xl">
            {profile.name.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="block">
                <span data-hero-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <div data-hero-item aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-accent" />
          <p data-hero-item className="mt-6 text-xl font-semibold tracking-wide text-foreground sm:text-2xl lg:text-3xl">
            {/* One part per line on a phone (split at the commas), a single line from `sm` up. */}
            {localize(profile.role, locale)
              .split(", ")
              .map((part, index, parts) => (
                <span key={part}>
                  {index > 0 && " "}
                  <span className="block sm:inline">
                    {part}
                    {index < parts.length - 1 && ","}
                  </span>
                </span>
              ))}
          </p>
          <div data-hero-item className="mt-6 flex flex-col items-start gap-y-1 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <Link href="/experience" className={`${textLinkHeroClass} order-2 sm:order-1`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelClass}>{t("experienceCta")}</span>
            </Link>
            <Link href="/projects" className={`${textLinkHeroClass} order-1 sm:order-2`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelActiveClass}>{t("projectsCta")}</span>
            </Link>
          </div>
          {links.length > 0 && (
            <ul data-hero-item className="-ml-3 mt-8 flex gap-3">
              {links.map((link) => (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                    className={linkClass}
                  >
                    <link.Icon badge={false} className="size-10" />
                    <span aria-hidden="true" className={tooltipClass}>
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {/* Phones only: the footer is hidden on the home there, and the credits sit under the icons. */}
          <p data-hero-item className="mt-10 font-sans text-sm text-muted sm:hidden">
            {tFooter("credits")} {tFooter("copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
