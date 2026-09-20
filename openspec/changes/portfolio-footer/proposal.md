## Why

The portfolio currently has a strong visual presence with hero, experience, and projects sections, but lacks a proper footer to visually close the page and provide a professional finish. A minimal footer with copyright and "back to top" navigation will improve page structure and usability.

## What Changes

- Add a `Footer.tsx` component rendered at the bottom of the page
- Display copyright text (© 2026 Roberta Amaro)
- Include a "back to top" link with smooth scroll integration
- Use the same design language and typography as the rest of the site (Jost for headings, IBM Plex Sans for text)
- Footer is minimal and doesn't duplicate existing contact links (already in hero)

## Capabilities

### New Capabilities
- `footer`: Footer component with copyright, minimal styling, and back-to-top navigation

### Modified Capabilities
<!-- No spec-level behavior changes to existing capabilities -->

## Impact

- New component file: `components/Footer.tsx`
- Layout modification: `app/[locale]/layout.tsx` to render Footer
- No changes to existing APIs or data structures
- No new dependencies required
