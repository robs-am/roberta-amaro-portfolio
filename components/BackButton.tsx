"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CapsuleSvg, menuButtonClass } from "@/components/header/capsuleIcon";
import { OPEN_MENU_EVENT, backTarget, cameFromMenu } from "@/components/header/menuEvents";
import { useRouter } from "@/i18n/navigation";

// In-page back arrow, drawn like the menu's buttons. It goes back to the home when the page was opened
// from a link there (the hero's); otherwise the menu is how you got here, so it reopens the menu.
export function BackButton() {
  const t = useTranslations("Header");
  const router = useRouter();
  // Read once, when the page opens: a direct load never came from the home.
  const [toHome] = useState(() => backTarget.toHome);

  return (
    <button
      type="button"
      aria-label={toHome ? t("home") : t("backToMenu")}
      onClick={() => {
        cameFromMenu.current = false;
        if (toHome) router.push("/");
        else window.dispatchEvent(new Event(OPEN_MENU_EVENT));
      }}
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
