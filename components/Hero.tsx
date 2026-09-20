"use client";


import { animate, stagger } from "animejs";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/ContactIcons";
import { onSmoothAnchorClick } from "@/components/header/smoothScroll";
import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

// three.js is only loaded in the browser, after the hero text, so it never delays first paint.
const HeroShapes = dynamic(() => import("@/components/HeroShapes").then((mod) => mod.HeroShapes), {
  ssr: false,
});

const linkClass =
  "inline-flex size-14 items-center justify-center rounded-full text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const ctaPrimaryClass =
  "inline-flex h-11 shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-accent/60 bg-accent/25 px-6 text-sm font-semibold text-highlight transition-[gap,padding,transform,background-color] duration-300 ease-expressive hover:bg-accent/35 dark:border-foreground dark:bg-foreground dark:text-background dark:hover:bg-foreground motion-safe:hover:gap-3.5 motion-safe:hover:scale-105 hover:pr-7 focus-visible:gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const ctaSecondaryClass =
  "inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-full border border-accent/40 bg-accent/15 px-5 text-sm font-semibold text-accent dark:border-foreground/40 dark:bg-transparent dark:text-foreground transition-[gap,padding,border-color,background-color,color] duration-300 ease-expressive motion-safe:hover:gap-3 hover:border-accent hover:bg-accent/25 dark:hover:border-foreground dark:hover:bg-foreground/10 focus-visible:gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");
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
      className="hero-reveal relative ml-[calc(50%-50vw)] w-screen snap-start flex h-[calc(100dvh-var(--header-height,0px))] flex-col justify-center overflow-x-hidden scroll-mt-(--header-height,0px)"
    >
      <HeroShapes />
      {/* Full-bleed for the same reason as the experience/projects sections: `main` caps content
          at max-w-7xl, which would otherwise clip this fade before it reaches the real edges. The
          shared glow's own radial mask still leaves a sliver of visible color right at this edge,
          which read as a hard line against the next (plain) section — this guarantees a clean
          fade to the real background color over the last stretch, regardless of the mask's math.
          -z-10, same as the glow, but painted after it in the DOM so it layers on top. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-b from-transparent to-background"
      />
      <div className="px-6 sm:px-8">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h1 className="text-6xl font-bold lg:text-8xl">
            {profile.name.split(" ").map((word, index) => (
              <span key={`${word}-${index}`}>
                {index > 0 && " "}
                <span data-hero-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <div data-hero-item aria-hidden="true" className="mx-auto mt-6 h-1 w-10 rounded-full bg-accent" />
          <p data-hero-item className="mt-4 text-2xl font-semibold tracking-wide text-foreground sm:text-3xl lg:text-4xl">
            {localize(profile.role, locale)}
          </p>
          <p data-hero-item className="mt-8 text-pretty text-xl leading-8 tracking-wide text-foreground/90">
            {localize(profile.bio, locale)}
          </p>
          <p data-hero-item className="mt-2 text-pretty text-lg leading-8 text-foreground/90">
            {localize(profile.focus, locale)}{" "}
            {profile.interests.map((interest, index) => (
              <span key={localize(interest, locale)}>
                {index > 0 && (index === profile.interests.length - 1 ? ` ${t("and")} ` : ", ")}
                {localize(interest, locale)}
              </span>
            ))}
            .
          </p>
          <div data-hero-item className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#experience" onClick={onSmoothAnchorClick} className={ctaSecondaryClass}>
              <ArrowIcon className="size-4 shrink-0" />
              <span>{t("experienceCta")}</span>
            </a>
            <a href="#projects" onClick={onSmoothAnchorClick} className={ctaPrimaryClass}>
              <ArrowIcon className="size-4 shrink-0" />
              <span>{t("projectsCta")}</span>
            </a>
          </div>
          {links.length > 0 && (
            <ul data-hero-item className="mt-8 flex justify-center gap-3">
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
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className ?? "size-3.5"}
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
