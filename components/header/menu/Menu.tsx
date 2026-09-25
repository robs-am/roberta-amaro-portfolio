"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Grain } from "@/components/background/Grain";
import { Credits } from "@/components/layout/Credits";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePathname } from "@/i18n/navigation";
import { ControlDock, DockDivider, dockButtonClass } from "../ControlDock";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { CloseIcon, OpenIcon } from "./MenuIcons";
import { MenuContacts } from "./MenuContacts";
import { HERO_REENTER_EVENT } from "./menuEvents";
import { MenuNav } from "./MenuNav";
import { MenuShapes } from "./MenuShapes";
import { useMenuControlAlignment } from "./useMenuControlAlignment";
import { useMenuDialog } from "./useMenuDialog";
import { useMenuHomeAlignment } from "./useMenuHomeAlignment";
import { useMenuNavigation } from "./useMenuNavigation";
import { useMenuShapes } from "./useMenuShapes";

const subscribe = () => () => {};

// Full-screen menu. The overlay is portaled to <body>: the header may carry a `backdrop-filter`,
// which would otherwise become the containing block of a `fixed` child and clip it to the header.
export function Menu() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const controlRowRef = useRef<HTMLDivElement>(null);
  const menuBodyRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const { shapesMounted, openMenu } = useMenuShapes(open, setOpen);
  const { pendingHref, navigate } = useMenuNavigation({ open, setOpen, pathname });
  useMenuDialog({ open, setOpen, overlayRef, openRef, closeRef });
  useMenuHomeAlignment({ open, pathname, menuBodyRef, controlRowRef });
  useMenuControlAlignment({ open, controlRowRef });

  // Closing back onto the home page without ever navigating away (close button, Escape, or "Home"
  // clicked while already there) is the only case where the hero underneath was already mounted and
  // just sat through the whole thing — everywhere else either a different page unmounts it or a fresh
  // navigation to home mounts it with its own entrance already playing.
  const wasOpenRef = useRef(open);
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (wasOpen && !open && pendingHref === null && pathname === "/") {
      window.dispatchEvent(new Event(HERO_REENTER_EVENT));
    }
  }, [open, pendingHref, pathname]);

  return (
    <>
      <button
        ref={openRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("menu.open")}
        onClick={openMenu}
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
            className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background transition-[clip-path,visibility] duration-700 ease-expressive motion-reduce:transition-none ${
              open ? "visible [clip-path:inset(0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
            }`}
          >
            {/* Before the shapes in the DOM, so the grain stays behind them. */}
            <Grain layerClassName="z-0" />
            {shapesMounted && <MenuShapes active={open && pendingHref === null} />}

            {/* Same atmosphere as the hero's (see Hero.tsx): dark mode only, softens the empty sky above the
                waves into the page's own glow so the wave's edge doesn't read as a stain against flat black.
                No explicit z-index — DOM order alone puts it above the grain/waves and below the content. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(ellipse_135%_100%_at_80%_82%,color-mix(in_oklab,var(--glow-1)_50%,transparent)_0%,transparent_82%)]"
            />

            {/* Same box as the header row, so the controls stay put when the menu opens. */}
            <div
              ref={controlRowRef}
              className="relative mx-auto flex min-h-11 max-w-7xl items-center justify-end gap-2 px-6 py-3 sm:px-8"
            >
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
                top; the control row above takes 4.25rem, so 4.75rem here). From `sm` up, on the home page,
                useMenuHomeAlignment overrides this with the hero name's exact position; elsewhere (no hero to
                match) it stays centered. flex-1 (not a fixed min-height) so the credits footer below always
                lands at the very bottom of the screen, same as the home's own (see Footer.tsx), instead of
                trailing right after the contacts wherever those happen to end. */}
            <div
              ref={menuBodyRef}
              className="menu-body relative mx-auto flex max-w-5xl flex-1 flex-col justify-center gap-10 px-6 pb-16 max-sm:justify-start max-sm:pt-[4.75rem] sm:pb-20"
            >
              <MenuNav open={open} pathname={pathname} onNavigate={navigate} />
              <MenuContacts open={open} />
            </div>
            {/* Same spot and markup as the home's own footer (see Footer.tsx): the menu is portaled past
                it, so it would otherwise never be seen while the menu is open. Not part of the row-enter
                stagger on purpose — it already sits there under the hero too, so it should read as the
                same fixed piece of the page, not as something the menu brings in. */}
            <div className="py-8 short:py-4 text-base">
              <div className="mx-auto max-w-7xl px-6 sm:px-8">
                <Credits />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
