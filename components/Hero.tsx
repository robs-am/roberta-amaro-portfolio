import { profile } from "@/data/profile";
import { localize, type Locale } from "@/data/types";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="hero-reveal py-16 sm:py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">
        {profile.name}
      </h1>
      <p className="mt-3 text-lg font-medium text-accent">
        {localize(profile.role, locale)}
      </p>
      <p className="mt-6 max-w-2xl leading-7 text-muted">
        {localize(profile.bio, locale)}
      </p>
    </section>
  );
}
