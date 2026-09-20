"use client";


import { animate, stagger } from "animejs";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/ContactIcons";
import {
  textLinkArrowHeroClass,
  textLinkHeroClass,
  textLinkLabelActiveClass,
  textLinkLabelClass,
} from "@/components/textLinkStyles";
import { profile } from "@/data/profile";
import { MENU_CLOSE_WAIT_MS, backTarget, cameFromMenu } from "@/components/header/menuEvents";
import { heroEntrance } from "@/components/shapesScene";
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

// Pages opened from the hero go back to the home, not to the menu (see BackButton).
const leaveToPage = () => {
  backTarget.toHome = true;
  cameFromMenu.current = false;
};

export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");
  const tFooter = useTranslations("Footer");
  const sectionRef = useRef<HTMLElement>(null);
  // Fixed at the first render: true when the home is reached again from another page (client-side), so
  // there is no entrance. A page load or reload starts with a fresh module, so it is false there.
  const [settled] = useState(() => heroEntrance.played);
  // Coming back through the menu, the fade-in waits for the overlay to finish closing.
  const [settleWait] = useState(() => (cameFromMenu.current ? MENU_CLOSE_WAIT_MS : 0));

  // Enters each `[data-hero-item]` in DOM order (bar → role → CTAs → links); the name words are CSS (globals.css).
  // CSS hides them only until this runs (see `[data-hero-item]` in globals.css), with a fallback
  // that shows them anyway. Reduced motion never hides them, so there is nothing to do.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || settled) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    // The name is a CSS animation that started at the first paint, before this ran: time everything else from it.
    const nameAnimation = section.querySelector<HTMLElement>("[data-hero-word]")?.getAnimations()[0];
    const elapsed = Number(nameAnimation?.currentTime ?? 0);
    heroEntrance.startedAt = performance.now() - elapsed;
    heroEntrance.played = true;
    const items = section.querySelectorAll<HTMLElement>("[data-hero-item]");
    for (const target of items) target.style.opacity = "0";
    section.dataset.ready = "";

    const animation = animate(items, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 1100,
      delay: stagger(140, { start: Math.max(1000 - elapsed, 0) }),
      ease: "outExpo",
    });

    return () => {
      animation.cancel();
    };
  }, [settled]);

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-settled={settled ? "" : undefined}
      style={{ "--hero-wait": `${settleWait}ms` } as React.CSSProperties}
      className="hero-reveal relative ml-[calc(50%-50vw)] w-screen flex flex-1 flex-col justify-center overflow-x-hidden scroll-mt-(--header-height,0px)"
    >
      <HeroShapes settled={settled} settleWait={settleWait} />
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl leading-[1.05] font-bold uppercase sm:text-6xl lg:text-8xl xl:text-9xl">
            {profile.name.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="block">
                <span
                  data-hero-word={index}
                  style={{ "--hero-index": index } as React.CSSProperties}
                  className="inline-block"
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <div data-hero-item style={{ "--hero-index": 2 } as React.CSSProperties} aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-accent" />
          <p data-hero-item style={{ "--hero-index": 3 } as React.CSSProperties} className="mt-6 text-xl font-semibold tracking-wide text-foreground sm:text-2xl lg:text-3xl">
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
          <div data-hero-item style={{ "--hero-index": 4 } as React.CSSProperties} className="mt-6 flex flex-col items-start gap-y-1 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <Link href="/experience" onClick={leaveToPage} className={`${textLinkHeroClass} order-2 sm:order-1`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelClass}>{t("experienceCta")}</span>
            </Link>
            <Link href="/projects" onClick={leaveToPage} className={`${textLinkHeroClass} order-1 sm:order-2`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelActiveClass}>{t("projectsCta")}</span>
            </Link>
          </div>
          {links.length > 0 && (
            <ul data-hero-item style={{ "--hero-index": 5 } as React.CSSProperties} className="-ml-3 mt-8 flex gap-3">
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
          <p data-hero-item style={{ "--hero-index": 6 } as React.CSSProperties} className="mt-10 font-sans text-sm text-muted sm:hidden">
            {tFooter("credits")} {tFooter("copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
