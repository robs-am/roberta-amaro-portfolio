"use client";


import { animate, cubicBezier, set, stagger } from "animejs";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/home/ContactIcons";
import { WaveMoodInput } from "@/components/home/WaveMoodInput";
import {
  textLinkArrowHeroClass,
  textLinkHeroClass,
  textLinkLabelClass,
} from "@/components/ui/textLinkStyles";
import { profile } from "@/data/profile";
import { HERO_REENTER_EVENT, backTarget, heroNavigation } from "@/components/header/menu/menuEvents";
import { heroEntrance } from "@/components/shapes/shapesScene";
import { localize, type Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { tooltipAboveClass } from "@/components/ui/tooltipStyles";

// three.js is only loaded in the browser, after the hero text, so it never delays first paint.
const HeroShapes = dynamic(() => import("@/components/home/HeroShapes").then((mod) => mod.HeroShapes), {
  ssr: false,
});

const linkClass =
  "group/link relative inline-flex size-16 items-center justify-center rounded-full text-[#3b3337] dark:text-foreground transition-colors hover:text-accent dark:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";


export function Hero({ locale }: Readonly<{ locale: Locale }>) {
  const t = useTranslations("Hero");
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

  // Pages opened from the hero go back to the home, not to the menu (see BackButton). The navigation starts with the
  // click, as for any link: this only lets the hero's text drift up and out while the page loads (the reverse of its
  // entrance), so the change of page is not a hard cut. Opening in a new tab or with reduced motion leaves it as is.
  const leavingRef = useRef(false);
  const leaveToPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    backTarget.toHome = true;
    const section = sectionRef.current;
    if (!section || leavingRef.current) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    leavingRef.current = true;
    heroNavigation.pending = true;

    // Releases the name's CSS keyframe so the inline styles can drive it (same as the re-entrance below).
    const words = section.querySelectorAll<HTMLElement>("[data-hero-word]");
    for (const word of words) word.style.animation = "none";
    const items = section.querySelectorAll<HTMLElement>("[data-hero-item]");
    animate([...words, ...items], {
      opacity: [1, 0],
      translateY: [0, -12],
      duration: 300,
      delay: stagger(40),
      ease: cubicBezier(0.2, 0, 0, 1),
    });
  };

  // Menu closing back onto an already-mounted hero (see Menu.tsx): the name's CSS wipe already played
  // once at first paint and (with `both`) is still holding its finished state — with nothing driving it
  // a second time, the name would just sit there fully visible while the items below fade in, reading as
  // if it had "snapped" in instantly. So it replays too, but as a plain fade/slide with the same feel as
  // the menu's own rows entering (menuRowEnter), not the wipe again.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onReenter = () => {
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
      const words = section.querySelectorAll<HTMLElement>("[data-hero-word]");
      // Releases the CSS keyframe's held end state so these inline styles can drive opacity/transform instead.
      for (const word of words) word.style.animation = "none";
      const items = section.querySelectorAll<HTMLElement>("[data-hero-item]");
      const targets = [...words, ...items];
      set(targets, { opacity: 0, translateY: 24 });
      animate(targets, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 700,
        delay: stagger(80, { start: 250 }),
        ease: cubicBezier(0.2, 0, 0, 1),
      });
    };

    window.addEventListener(HERO_REENTER_EVENT, onReenter);
    return () => window.removeEventListener(HERO_REENTER_EVENT, onReenter);
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
      className="hero-reveal relative ml-[calc(50%-50vw)] w-screen flex flex-1 flex-col justify-center overflow-x-hidden sm:pb-20 max-sm:justify-start max-sm:pt-36 scroll-mt-(--header-height,0px)"
    >
      <HeroShapes />
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="hero-lift text-[#3b3337] dark:text-[#e4d6cc] text-[clamp(3rem,14vw,4.25rem)] leading-[1.05] font-bold uppercase sm:text-5xl sm:whitespace-nowrap md:text-6xl lg:text-[min(4.5rem,10vh)] xl:text-[min(5rem,9vh)] 2xl:text-[min(6.5rem,10vh)]">
          {profile.name.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} className="inline-block">
              <span
                data-hero-word={index}
                style={{ "--hero-index": index } as React.CSSProperties}
                className="inline-block"
              >
                {word}
              </span>
              {index < profile.name.split(" ").length - 1 && " "}
            </span>
          ))}
        </h1>
        <div className="hero-lift max-w-2xl">
          <p data-hero-item style={{ "--hero-index": 3 } as React.CSSProperties} className="mt-6 text-[clamp(1.25rem,5.5vw,1.375rem)] font-semibold tracking-wide text-balance text-[#3b3337] dark:text-[#ebded5] sm:mt-8 lg:text-3xl">
            {/* The size follows the width: the English role fits one line on a phone, the longer pt one wraps in two. */}
            {localize(profile.role, locale)}
          </p>
        </div>
        {/* Wider than the role/bio column on purpose: justify-end below needs the full text-block width to
            push the icons toward its right edge instead of crowding right after "Projects". */}
        <div className="hero-lift mt-6 flex flex-col gap-y-4 sm:mt-14 short:mt-5">
          <div data-hero-item data-hero-cta style={{ "--hero-index": 5 } as React.CSSProperties} className="flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <Link href="/experience" onClick={leaveToPage} className={`${textLinkHeroClass} order-2 sm:order-1`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelClass}>{t("experienceCta")}</span>
            </Link>
            <Link href="/projects" onClick={leaveToPage} className={`${textLinkHeroClass} order-1 sm:order-2`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelClass}>{t("projectsCta")}</span>
            </Link>
            <Link href="/about" onClick={leaveToPage} className={`${textLinkHeroClass} order-3`}>
              <ArrowIcon className={textLinkArrowHeroClass} />
              <span className={textLinkLabelClass}>{t("aboutCta")}</span>
            </Link>
          </div>
          {links.length > 0 && (
            <ul data-hero-item style={{ "--hero-index": 6 } as React.CSSProperties} className="-mr-4 flex justify-end gap-1 min-[360px]:hidden">
              {links.map((link) => (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                    className={linkClass}
                  >
                    <link.Icon
                      badge={false}
                      className="size-8 transition-transform duration-300 ease-expressive motion-safe:group-hover/link:-translate-y-0.5"
                    />
                    <span aria-hidden="true" className={tooltipAboveClass}>
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* In the flow on a phone so it stays with the content when the height changes; pinned to the corner from sm up. */}
        <WaveMoodInput />
      </div>
    </section>
  );
}
