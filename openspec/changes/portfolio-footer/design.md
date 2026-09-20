## Context

The portfolio currently has a main layout (`app/[locale]/layout.tsx`) that renders the `Header`, `BackgroundGlow`, content sections (hero, experience, projects), and the `RevealObserver`. The page uses design tokens defined in `app/globals.css` (colors, fonts, spacing, motion). Navigation includes smooth scroll functionality via `components/header/smoothScroll.ts`.

## Goals / Non-Goals

**Goals:**
- Render a footer component at the bottom of every page (`/pt` and `/en`)
- Display copyright text (translatable via messages)
- Provide a "back to top" link using the existing smooth scroll implementation
- Use minimal styling with no visual hierarchy or decorative elements
- Ensure accessibility and responsiveness

**Non-Goals:**
- Contact links (already in hero; footer will not duplicate)
- Newsletter signup or email collection
- Social media links (already in hero icons)
- Dynamic content or data fetching
- Footer-specific animations or visual effects

## Decisions

### 1. Component Structure: Create `components/Footer.tsx` as a simple client or server component

**Decision**: `Footer.tsx` will be a server component (no `'use client'` by default). The back-to-top link will be an anchor `<a>` tag with `href="#"` (or a native HTML button styled as a link) that is hijacked by the existing smooth scroll handler if JavaScript is available.

**Rationale**: Server components are simpler and reduce client JS. The smooth scroll logic already handles all `<a>` tags with hash links; footer can reuse it without new client-side code.

**Alternatives considered**:
- Client component with custom `onClick` handler: adds client JS and duplicates smooth scroll logic ❌
- Button with `role="link"` in footer: unnecessary accessibility overhead when native anchor works ❌

### 2. Styling: Use `--muted` token for text color

**Decision**: Footer text (copyright + link) will use `color: var(--muted)` and `opacity` reduced if needed to ensure it blends into the background and doesn't compete with main content.

**Rationale**: `--muted` is already defined as a design token for secondary UI and matches the site's color strategy. It provides contrast (WCAG AA) while staying visually recessive.

**Alternatives considered**:
- `--foreground` with opacity: less semantic, requires coordination ❌
- Custom color token: violates design token reuse and complicates maintenance ❌

### 3. Layout Position: Footer rendered in the main layout, below content

**Decision**: Footer will be added to `app/[locale]/layout.tsx` after the main `{children}` to ensure it appears at the bottom of every page without requiring per-page additions.

**Rationale**: Single source of truth; simplifies consistency across routes. Footer is a shell concern, not page-specific content.

**Alternatives considered**:
- Add to `app/[locale]/page.tsx` only: not available on other routes (e.g., 404 page) ❌
- Sticky footer with flexbox layout: adds complexity and visual weight; page content should flow naturally ❌

### 4. Back-to-Top Implementation: Reuse existing `smoothScroll.ts` and hash navigation

**Decision**: Footer link will be an anchor (`<a href="#"`) with a click handler (or simple anchor behavior) that is caught by the global smooth scroll logic. No new code needed beyond the footer markup.

**Rationale**: Avoids duplicating scroll logic and keeps implementation minimal. The smooth scroll handler is already installed and working.

**Alternatives considered**:
- Custom `useEffect` in footer for scroll: duplicates smooth scroll logic and complicates testing ❌
- Use `window.scrollTo()` directly: doesn't respect the project's smooth scroll settings ❌

### 5. Copy and Localization: Store copyright text in `messages/pt.json` and `messages/en.json`

**Decision**: Copyright text and "back to top" link label will be keys in the message files:
- `Footer.copyright`: "© 2026 Roberta Amaro" (PT), "© 2026 Roberta Amaro" (EN - same name)
- `Footer.backToTop`: "Voltar ao topo" (PT), "Back to top" (EN)

**Rationale**: Consistent with the project's i18n setup; allows future updates without code changes.

**Alternatives considered**:
- Hardcode in component: not translatable, violates i18n pattern ❌

### 6. Styling Approach: CSS class or Tailwind utilities

**Decision**: Use Tailwind utilities for margin, padding, and font size; use CSS custom properties (`var(--muted)`) for color to respect theme tokens.

**Rationale**: Tailwind is already integrated; CSS variables for color ensure token consistency and theme switching.

**Alternatives considered**:
- Global CSS class `.footer`: adds unnecessary complexity; Tailwind handles layout ✓ but using custom properties for tokens is better ✓

## Risks / Trade-offs

- **Accessibility Trade-off**: Using `<a href="#"` requires that smooth scroll click handler is loaded. If JS is disabled, clicking "back to top" will do nothing (anchor does not work). **Mitigation**: Specify in implementation that the smooth scroll handler must be loaded before the footer is interactive. Document this as acceptable (footer is a UX enhancement, not a core feature).

- **Motion Preference**: Smooth scroll must respect `prefers-reduced-motion: reduce`. **Mitigation**: The existing `smoothScroll.ts` already checks this; verify that footer link is caught by the same handler.

- **Token Consistency**: `--muted` may vary in future design updates. **Mitigation**: Using CSS variables (not hardcoded colors) ensures footer automatically updates with theme changes.

## Open Questions

None at this stage. The design is straightforward and aligns with existing patterns in the codebase.
