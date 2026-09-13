import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass =
  "rounded-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export async function Header() {
  const t = await getTranslations("Header");

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {profile.name}
        </Link>
        <nav
          aria-label={t("navLabel")}
          className="order-last w-full sm:order-none sm:w-auto"
        >
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <a href="#experience" className={navLinkClass}>
                {t("nav.experience")}
              </a>
            </li>
            <li>
              <a href="#projects" className={navLinkClass}>
                {t("nav.projects")}
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
