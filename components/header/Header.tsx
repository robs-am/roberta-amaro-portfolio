import { getTranslations } from "next-intl/server";
import { HeaderShell } from "./HeaderShell";
import { HideOnHome } from "./HideOnHome";
import { HomeLink } from "./HomeLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Menu } from "./Menu";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const t = await getTranslations("Header");

  return (
    <HeaderShell>
      <div className="mx-auto flex min-h-11 max-w-7xl items-center gap-6 px-6 py-3 sm:px-8">
        <HideOnHome>
          <HomeLink label={t("home")} />
        </HideOnHome>
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Menu />
        </div>
      </div>
    </HeaderShell>
  );
}
