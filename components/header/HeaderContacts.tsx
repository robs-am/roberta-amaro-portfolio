import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { EmailIcon, GithubIcon, LinkedinIcon } from "@/components/home/ContactIcons";
import { tooltipBelowClass } from "@/components/ui/tooltipStyles";
import { profile } from "@/data/profile";
import { ControlDock, DockDivider, dockButtonClass } from "./ControlDock";
import { ShowOnHome } from "./ShowOnHome";

// The home's contacts (email, LinkedIn, GitHub), on the header's free left side where the inner pages put home/back,
// in the same capsule as the controls opposite. From sm up only: on a phone the row would crowd the dock, so the
// hero keeps its own list there (see Hero).
export async function HeaderContacts() {
  const t = await getTranslations("Hero");

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  if (links.length === 0) return null;

  return (
    <ShowOnHome>
      <div className="hidden sm:block">
        <ControlDock>
          {links.map((link, index) => (
            <Fragment key={link.href}>
              {index > 0 && <DockDivider />}
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                className={`${dockButtonClass} group/tip relative`}
              >
                <link.Icon badge={false} className="size-6" />
                <span aria-hidden="true" className={tooltipBelowClass}>
                  {link.label}
                </span>
              </a>
            </Fragment>
          ))}
        </ControlDock>
      </div>
    </ShowOnHome>
  );
}
