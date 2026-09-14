import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <a
          href="#hero"
          className="rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {profile.name}
        </a>
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
