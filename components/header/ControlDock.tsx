import type { ReactNode } from "react";

// The header's language, theme and menu controls share one outlined capsule, the same hollow-pill
// shape as the menu icons. Used by the header and by the open menu, so it sits in the same place in both.
export function ControlDock({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-11 items-center gap-0.5 rounded-full border border-foreground/30 bg-background/80 p-1 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

export function DockDivider() {
  return <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-border" />;
}

// Inner control: 36px, so the capsule is 44px tall with its 1px border and 4px padding.
export const dockButtonClass =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// The menu's open button: the icon alone on a phone, with the word "Menu" beside it from `sm` up, so the capsule
// reads as a menu to people who do not know the icon.
export const dockMenuButtonClass = `${dockButtonClass} gap-1.5 sm:w-auto sm:pr-3.5 sm:pl-2`;
