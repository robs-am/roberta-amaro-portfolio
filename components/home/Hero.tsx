"use client";


import { animate, stagger } from "animejs";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/home/ContactIcons";
import {
  textLinkArrowHeroClass,
  textLinkHeroClass,
  textLinkLabelActiveClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { profile } from "@/data/profile";
import { backTarget } from "@/components/header/menuEvents";
import { heroEntrance } from "@/components/shapes/shapesScene";
import { localize, type Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";

// three.js is only loaded in the browser, after the hero text, so it never delays first paint.
const HeroShapes = dynamic(() => import("@/components/home/HeroShapes").then((mod) => mod.HeroShapes), {
  ssr: false,
});

const linkClass =
  "group/link relative inline-flex size-16 items-center justify-center rounded-full text-foreground transition-colors hover:text-accent dark:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Visual label for the icon-only links (they already have an aria-label, so it is hidden from assistive tech).
const tooltipClass =
  "pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none";

// Pages opened from the hero go back to the home, not to the menu (see BackButton).
const leaveToPage = () => {
  backTarget.toHome = true;
};

export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");
  const tFooter = useTranslations("Footer");
  const sectionRef = useRef<HTMLElement>(null);

  // Enters each `[data-hero-item]` in DOM order (bar → role → CTAs → links); the name words are CSS (globals.css).
  // CSS hides them only until this runs (see `[data-hero-item]` in globals.css), with a fallback
  // that shows them anyway. Reduced motion never hides them, so there is nothing to do.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    // The name is a CSS animation that started at the first paint, before this ran: time everything else from it.
    const nameAnimation = section.querySelector<HTMLElement>("[data-hero-word]")?.getAnimations()[0];
    const elapsed = Number(nameAnimation?.currentTime ?? 0);
    heroEntrance.startedAt = performance.now() - elapsed;
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
      className="hero-reveal relative ml-[calc(50%-50vw)] w-screen flex flex-1 min-h-[calc(100dvh-4.25rem)] flex-col justify-center overflow-x-hidden sm:pb-20 max-sm:justify-start max-sm:pt-36 scroll-mt-(--header-height,0px)"
    >
      <HeroShapes />
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="hero-lift max-w-2xl">
          <h1 className="text-foreground text-[clamp(3rem,17.5vw,4.25rem)] leading-[1.05] font-bold uppercase sm:text-6xl lg:text-[min(6rem,15vh)] xl:text-[min(6.5rem,14vh)]">
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
          <div data-hero-item style={{ "--hero-index": 2 } as React.CSSProperties} aria-hidden="true" className="mt-6 short:mt-4 h-1 w-10 rounded-full bg-accent" />
          <p data-hero-item style={{ "--hero-index": 3 } as React.CSSProperties} className="mt-6 text-[clamp(1.25rem,5.5vw,1.375rem)] font-semibold tracking-wide text-balance text-foreground sm:mt-8 lg:text-3xl">
            {/* The size follows the width: the English role fits one line on a phone, the longer pt one wraps in two. */}
            {localize(profile.role, locale)}
          </p>
          <div data-hero-item data-hero-cta style={{ "--hero-index": 4 } as React.CSSProperties} className="mt-6 flex flex-col items-start gap-y-1 sm:mt-14 short:mt-5 sm:flex-row sm:flex-wrap sm:gap-x-8">
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
            <ul data-hero-item style={{ "--hero-index": 5 } as React.CSSProperties} className="-ml-3 mt-8 short:mt-4 flex gap-3 sm:mt-14">
              {links.map((link) => (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                    className={linkClass}
                  >
                    <span className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-foreground/14 transition-colors group-hover/link:border-accent dark:group-hover/link:border-foreground">
                      <link.Icon badge={false} className="size-8" />
                    </span>
                    <span aria-hidden="true" className={tooltipClass}>
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {/* The footer is not rendered on the home (see Footer): the credits sit right under the icons, so they
              do not float at the bottom of a tall screen far from the block they belong to. */}
          <p data-hero-item style={{ "--hero-index": 6 } as React.CSSProperties} className="mt-4 font-sans text-sm text-muted sm:mt-8 sm:text-base">
            {tFooter("credits")} {tFooter("copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
