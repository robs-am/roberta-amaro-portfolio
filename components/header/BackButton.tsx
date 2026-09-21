"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { CapsuleSvg, menuButtonClass } from "./capsuleIcon";
import { OPEN_MENU_EVENT, backTarget, cameFromMenu } from "./menuEvents";

// Back arrow in the header, next to the home icon, drawn like the menu's buttons. The menu is how every page
// is reached, so it reopens the menu. When the page was opened from a link on the home (the hero's) the
// way back is the home, which the icon beside it already is, so the arrow is not shown.
export function BackButton() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  // The header outlives page changes, so the target is read again each time the page changes
  // (a direct load never came from the home).
  const [seen, setSeen] = useState(pathname);
  const [toHome, setToHome] = useState(() => backTarget.toHome);
  if (seen !== pathname) {
    setSeen(pathname);
    setToHome(backTarget.toHome);
  }

  if (toHome) return null;

  return (
    <button
      type="button"
      aria-label={t("backToMenu")}
      onClick={() => {
        cameFromMenu.current = false;
        window.dispatchEvent(new Event(OPEN_MENU_EVENT));
      }}
      className={menuButtonClass}
    >
      <CapsuleSvg>
        <rect x="3.5" y="10" width="17" height="4" rx="2" />
        <rect x="3.5" y="10" width="10" height="4" rx="2" transform="rotate(45 5.5 12)" />
        <rect x="3.5" y="10" width="10" height="4" rx="2" transform="rotate(-45 5.5 12)" />
      </CapsuleSvg>
    </button>
  );
}
