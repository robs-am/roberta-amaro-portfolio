"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { navItems } from "./navItems";

const barClass =
  "absolute left-0 h-0.5 w-full rounded-full bg-current transition duration-300 ease-expressive motion-reduce:transition-none";

export function MobileMenu() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      buttonRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const header = buttonRef.current?.closest("header");
      if (header && !header.contains(event.target as Node)) close();
    };

    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktopQuery.addEventListener("change", onBreakpointChange);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktopQuery.removeEventListener("change", onBreakpointChange);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("menu.close") : t("menu.open")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span className={`${barClass} top-0 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`${barClass} top-1.5 ${open ? "opacity-0" : ""}`} />
          <span className={`${barClass} top-3 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </span>
      </button>

      <div
        id={panelId}
        inert={!open}
        className={`absolute inset-x-0 top-full grid bg-background transition-[grid-template-rows,box-shadow] duration-300 ease-expressive motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] shadow-lg shadow-black/10 dark:shadow-black/40" : "grid-rows-[0fr] shadow-none"
        }`}
      >
        <nav aria-label={t("navLabel")} className="overflow-hidden">
          <ul className="mx-auto flex max-w-5xl flex-col border-b border-border px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-sm text-base font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t(`nav.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
