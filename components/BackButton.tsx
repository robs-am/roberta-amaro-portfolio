"use client";

import { useTranslations } from "next-intl";
import { CapsuleSvg, menuButtonClass } from "@/components/header/capsuleIcon";
import { OPEN_MENU_EVENT } from "@/components/header/menuEvents";

// In-page back arrow, drawn like the menu's buttons. The menu is how you get to every page, so
// going back means reopening it.
export function BackButton() {
  const t = useTranslations("Header");

  return (
    <button
      type="button"
      aria-label={t("backToMenu")}
      onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
      className={`${menuButtonClass} -ml-2.5 mb-4`}
    >
      <CapsuleSvg>
        <rect x="3.5" y="10" width="17" height="4" rx="2" />
        <rect x="3.5" y="10" width="10" height="4" rx="2" transform="rotate(45 5.5 12)" />
        <rect x="3.5" y="10" width="10" height="4" rx="2" transform="rotate(-45 5.5 12)" />
      </CapsuleSvg>
    </button>
  );
}
