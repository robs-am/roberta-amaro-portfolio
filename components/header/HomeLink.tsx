"use client";

import { Link } from "@/i18n/navigation";
import { cameFromMenu } from "./menuEvents";

export function HomeLink({ label }: { label: string }) {
  return (
    <Link
      href="/"
      onClick={() => {
        cameFromMenu.current = false;
      }}
      aria-label={label}
      className="flex size-11 shrink-0 items-center justify-center rounded-sm text-foreground transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <HomeIcon />
    </Link>
  );
}

// Tabler Icons (MIT).
function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}
