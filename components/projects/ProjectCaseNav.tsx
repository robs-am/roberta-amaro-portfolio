"use client";

import { useEffect, useState } from "react";
import { focusRing } from "./styles";

/**
 * Side index of a case page. The section nearest the top of the viewport is the current one; the
 * links are plain anchors, so it works (without the highlight) before hydration.
 */
export function ProjectCaseNav({
  label,
  sections,
}: Readonly<{ label: string; sections: { id: string; label: string }[] }>) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections.flatMap(({ id }) => document.getElementById(id) ?? []);
    // A section counts as current once it crosses the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={label} className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">{label}</p>
      <ol className="mt-4 border-l border-border">
        {sections.map((section, index) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px flex gap-3 border-l py-2 pl-4 text-base transition-colors duration-300 motion-reduce:transition-none ${focusRing} ${
                  active
                    ? "border-accent font-medium text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs leading-6" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
