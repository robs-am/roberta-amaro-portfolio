import { getTranslations } from "next-intl/server";
import { ContactLinks } from "./ContactLinks";
import { DesktopNav } from "./DesktopNav";
import { HeaderShell } from "./HeaderShell";
import { HideOnHome } from "./HideOnHome";
import { HomeLink } from "./HomeLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { navItems } from "./navItems";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const t = await getTranslations("Header");
  const labels = Object.fromEntries(navItems.map((item) => [item.key, t(`nav.${item.key}`)])) as Record<
    (typeof navItems)[number]["key"],
    string
  >;

  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3 sm:px-8">
        <HideOnHome>
          <HomeLink label={t("home")} />
          <DesktopNav navLabel={t("navLabel")} labels={labels} />
        </HideOnHome>
        <div className="ml-auto flex items-center gap-2">
          <HideOnHome>
            <ContactLinks className="hidden md:flex" />
          </HideOnHome>
          <LocaleSwitcher />
          <ThemeToggle />
          <HideOnHome>
            <MobileMenu />
          </HideOnHome>
        </div>
      </div>
    </HeaderShell>
  );
}
