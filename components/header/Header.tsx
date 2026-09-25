import { getTranslations } from "next-intl/server";
import { BackButton } from "./BackButton";
import { ControlDock, DockDivider } from "./ControlDock";
import { HeaderShell } from "./HeaderShell";
import { HideOnHome } from "./HideOnHome";
import { HomeLink } from "./HomeLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Menu } from "./menu/Menu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export async function Header() {
  const t = await getTranslations("Header");

  return (
    <HeaderShell>
      <div className="mx-auto flex min-h-11 max-w-7xl items-center gap-6 px-6 py-3 sm:px-8">
        <HideOnHome>
          <div className="flex items-center gap-1">
            <HomeLink label={t("home")} />
            <BackButton />
          </div>
        </HideOnHome>
        {/* Targeted by useMenuControlAlignment so the menu's own dock can match this row's exact
            position instead of trusting two "identical" `max-w-7xl` rows to land in the same place. */}
        <div id="header-controls" className="ml-auto">
          <ControlDock>
            <LocaleSwitcher />
            <DockDivider />
            <ThemeToggle />
            <DockDivider />
            <Menu />
          </ControlDock>
        </div>
      </div>
    </HeaderShell>
  );
}
