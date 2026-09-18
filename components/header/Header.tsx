import { getTranslations } from "next-intl/server";
import { ContactLinks } from "./ContactLinks";
import { DesktopNav } from "./DesktopNav";
import { HeaderShell } from "./HeaderShell";
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
        <HomeLink label={t("home")} />
        <DesktopNav navLabel={t("navLabel")} labels={labels} />
        <div className="ml-auto flex items-center gap-2">
          <ContactLinks className="hidden md:flex" />
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
