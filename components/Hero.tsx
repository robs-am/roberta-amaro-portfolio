import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

const linkClass =
  "inline-flex size-12 items-center justify-center rounded-md text-foreground transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("Hero");

  const links = [
    profile.email && { href: `mailto:${profile.email}`, label: t("email"), Icon: EmailIcon, external: false },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: t("linkedin"), Icon: LinkedinIcon, external: true },
    profile.githubUrl && { href: profile.githubUrl, label: t("github"), Icon: GithubIcon, external: true },
  ].filter((link) => !!link);

  return (
    <section id="hero" className="hero-reveal scroll-mt-(--header-height,0px) py-16 sm:py-24">
      <h1 className="text-5xl font-bold lg:text-7xl">
        {profile.name}
      </h1>
      <div aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-accent" />
      <p className="mt-3 text-sm font-semibold tracking-wide text-foreground uppercase">
        {localize(profile.role, locale)}
      </p>
      <p className="mt-8 max-w-2xl text-pretty leading-7 text-foreground/90">
        {localize(profile.bio, locale)}
      </p>
      <p className="mt-2 max-w-2xl text-pretty leading-7 text-foreground/90">
        {localize(profile.focus, locale)}{" "}
        {profile.interests.map((interest, index) => (
          <span key={localize(interest, locale)}>
            {index > 0 && (index === profile.interests.length - 1 ? ` ${t("and")} ` : ", ")}
            <span className="font-semibold text-highlight">{localize(interest, locale)}</span>
          </span>
        ))}
        .
      </p>
      {links.length > 0 && (
        <ul className="mt-6 flex gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.external ? `${link.label} ${t("newTab")}` : link.label}
                className={linkClass}
              >
                <link.Icon />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Tabler Icons (MIT), same circular badge treatment as the brand marks below for a consistent row.
function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <g transform="translate(12 12) scale(0.7) translate(-12 -12)">
        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
        <path d="M3 7l9 6l9 -6" />
      </g>
    </svg>
  );
}

// Outline brand marks (Tabler Icons, MIT) — official logos only ship filled; this is the stroke rendition.
// Both get the same circular badge so the octocat (which has no natural container) reads clearly, like the LinkedIn mark's square does.
function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <g transform="translate(12 12) scale(0.62) translate(-12 -12)">
        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
      </g>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0 -4 0" />
    </svg>
  );
}
