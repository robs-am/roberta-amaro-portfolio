import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section id="hero" className="hero-reveal scroll-mt-(--header-height,0px) py-16 sm:py-24">
      <h1 className="text-5xl font-bold lg:text-7xl">
        {profile.name}
      </h1>
      <div aria-hidden="true" className="mt-6 h-1 w-10 rounded-full bg-accent" />
      <p className="mt-3 text-sm font-semibold tracking-wide text-foreground uppercase">
        {localize(profile.role, locale)}
      </p>
      <p className="mt-8 max-w-2xl leading-7 text-foreground/90">
        {localize(profile.bio, locale)}
      </p>
    </section>
  );
}
