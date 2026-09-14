import { getTranslations } from "next-intl/server";
import { BackToTopLink } from "./BackToTopLink";
import { DesktopNav } from "./DesktopNav";
import { HeaderShell } from "./HeaderShell";
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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-3 sm:px-8">
        <BackToTopLink label={t("backToTop")} />
        <DesktopNav navLabel={t("navLabel")} labels={labels} />
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
