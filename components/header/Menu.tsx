"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Grain } from "@/components/background/Grain";
import { textLinkArrowLargeClass, textLinkLabelClass, textLinkLargeClass } from "@/components/ui/textLinkStyles";
import { profile } from "@/data/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { CapsuleSvg } from "./capsuleIcon";
import { ControlDock, DockDivider, dockButtonClass } from "./ControlDock";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { OPEN_MENU_EVENT, backTarget } from "./menuEvents";
import { MenuShapes } from "./MenuShapes";
import { navItems } from "./navItems";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const subscribe = () => () => {};

// Matches the overlay's `duration-700` reveal transition.
const CLOSE_DURATION_MS = 700;

// Full-screen menu. The overlay is portaled to <body>: the header may carry a `backdrop-filter`,
// which would otherwise become the containing block of a `fixed` child and clip it to the header.
export function Menu() {
  const t = useTranslations("Header");
  const tHero = useTranslations("Hero");
  const [open, setOpen] = useState(false);
  const [shapesMounted, setShapesMounted] = useState(false);
  const panelId = useId();
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // The in-page back arrow (see BackButton) reopens the menu from outside the header.
  useEffect(() => {
    const openMenu = () => {
      setShapesMounted(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_MENU_EVENT, openMenu);
    return () => window.removeEventListener(OPEN_MENU_EVENT, openMenu);
  }, []);

  useEffect(() => {
    if (!open) return;
    const opener = openRef.current;

    // Keep keyboard and screen-reader users inside the overlay: everything else in <body> goes inert.
    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlayRef.current && element.tagName !== "SCRIPT",
    );
    for (const element of siblings) element.inert = true;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      for (const element of siblings) element.inert = false;
      opener?.focus();
    };
  }, [open]);

  // The 3D layer exists only while the menu is visible: it starts on open and is torn down once the
  // close transition has finished, so it does not keep a WebGL context alive on every page.
  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setShapesMounted(false), CLOSE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const contacts = [
    profile.email && { href: `mailto:${profile.email}`, label: tHero("email"), external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: tHero("linkedin"), external: true },
    profile.githubUrl && { href: profile.githubUrl, label: tHero("github"), external: true },
  ].filter((link) => !!link);

  // Each row enters a beat after the previous one; on close everything leaves together.
  const enter = (index: number) => ({
    className: `transition duration-700 ease-expressive motion-reduce:transition-none ${
      open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: open ? `${250 + index * 80}ms` : "0ms" },
  });
  const contactsEnter = enter(navItems.length);

  return (
    <>
      <button
        ref={openRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("menu.open")}
        onClick={() => {
          setShapesMounted(true);
          setOpen(true);
        }}
        className={dockButtonClass}
      >
        <OpenIcon />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("menu.label")}
            inert={!open}
            className={`fixed inset-0 z-40 overflow-y-auto bg-background transition-[clip-path,visibility] duration-700 ease-expressive motion-reduce:transition-none ${
              open ? "visible [clip-path:inset(0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
            }`}
          >
            {/* Before the shapes in the DOM, so the grain stays behind them. */}
            <Grain layerClassName="z-0" />
            {shapesMounted && <MenuShapes open={open} />}

            {/* Same box as the header row, so the controls stay put when the menu opens. */}
            <div className="relative mx-auto flex min-h-11 max-w-7xl items-center justify-end gap-2 px-6 py-3 sm:px-8">
              <ControlDock>
                <LocaleSwitcher />
                <DockDivider />
                <ThemeToggle />
                <DockDivider />
                <button
                  ref={closeRef}
                  type="button"
                  aria-label={t("menu.close")}
                  onClick={() => setOpen(false)}
                  className={dockButtonClass}
                >
                  <CloseIcon />
                </button>
              </ControlDock>
            </div>

            {/* On a phone the list starts at the same height as the home's text (Hero: pt-36 = 9rem from the
                top; the control row above takes 4.25rem, so 4.75rem here). From `sm` up both are centered. */}
            <div className="menu-body relative mx-auto flex min-h-[calc(100dvh-4.25rem)] max-w-5xl flex-col justify-center gap-10 px-6 pb-16 max-sm:justify-start max-sm:pt-[4.75rem] sm:px-8">
              <nav aria-label={t("navLabel")}>
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const active = pathname === item.href;
                    const { className, style } = enter(index);

                    return (
                      <li key={item.href} className={className} style={style}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => {
                            backTarget.toHome = false;
                            setOpen(false);
                          }}
                          className={`menu-nav-link inline-flex items-baseline gap-3 rounded-sm font-display text-[clamp(2rem,10.5vw,3rem)] leading-[1.1] font-bold tracking-wide uppercase transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-7xl lg:text-8xl ${
                            active ? "text-accent" : "text-foreground"
                          }`}
                        >
                          <span aria-hidden="true" className="font-sans text-sm font-medium tracking-normal text-muted">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {t(`nav.${item.key}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {contacts.length > 0 && (
                <ul
                  className={`menu-contacts flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-10 ${contactsEnter.className}`}
                  style={contactsEnter.style}
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
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function OpenIcon() {
  return (
    <CapsuleSvg className="size-7">
      <rect x="3" y="4.5" width="18" height="5" rx="2.5" />
      <rect x="3" y="14.5" width="18" height="5" rx="2.5" />
    </CapsuleSvg>
  );
}

function CloseIcon() {
  return (
    <CapsuleSvg className="size-7">
      <rect x="2" y="9.5" width="20" height="5" rx="2.5" transform="rotate(45 12 12)" />
      <rect x="2" y="9.5" width="20" height="5" rx="2.5" transform="rotate(-45 12 12)" />
    </CapsuleSvg>
  );
}
