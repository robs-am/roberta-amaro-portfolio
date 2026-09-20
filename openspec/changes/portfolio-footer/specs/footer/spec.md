## Purpose

Provides a minimal footer component that closes the page visually with copyright information and a back-to-top navigation link, improving page structure and usability without duplicating existing contact links from the hero section.

## ADDED Requirements

### Requirement: Footer renders at the bottom of every page

The system SHALL render a `<footer>` element at the bottom of the main layout in both `/pt` and `/en` routes. The footer SHALL be positioned below all page content and above the bottom viewport edge.

#### Scenario: Footer appears on page load
- **WHEN** user loads `/pt` or `/en`
- **THEN** footer is visible at the bottom of the page below hero, experience, and projects sections

#### Scenario: Footer persists on scroll
- **WHEN** user scrolls through page content
- **THEN** footer remains at the bottom and scrolls with the page (not sticky/fixed)

### Requirement: Footer displays copyright text

The system SHALL display copyright text in the format "© 2026 Roberta Amaro" or similar, written in Portuguese on `/pt` and English on `/en` (translations stored in messages).

#### Scenario: Portuguese copyright
- **WHEN** user views `/pt`
- **THEN** footer displays copyright text in Portuguese

#### Scenario: English copyright
- **WHEN** user views `/en`
- **THEN** footer displays copyright text in English

### Requirement: Footer includes back-to-top link with smooth scroll

The system SHALL provide a clickable "back to top" link that uses the existing smooth scroll implementation (same as header navigation links). The link MAY display as text, an icon (chevron-up), or both.

#### Scenario: Back-to-top link scrolls to top
- **WHEN** user clicks the back-to-top link
- **THEN** page smoothly scrolls to the top with 650ms animation and cubic-ease timing

#### Scenario: Smooth scroll respects motion preferences
- **WHEN** `prefers-reduced-motion: reduce` is set in user preferences
- **THEN** scroll to top is instantaneous (no animation)

#### Scenario: Modified clicks open in new context
- **WHEN** user Cmd/Ctrl/Shift/Alt-clicks the back-to-top link
- **THEN** click is ignored or handled as default anchor behavior (not forced to smooth scroll)

### Requirement: Footer uses minimal design and typography

The system SHALL style the footer with:
- Text color in `--muted` token (text blend into background, readable but not prominent)
- Font: IBM Plex Sans (same as body text), small size (0.875rem or smaller)
- Padding/margin appropriate for a compact footer (no excessive whitespace)
- No decorative elements, borders, or backgrounds beyond the page background

#### Scenario: Footer text is readable in light mode
- **WHEN** user views footer in light theme
- **THEN** text passes WCAG AA contrast (4.5:1) against the light background

#### Scenario: Footer text is readable in dark mode
- **WHEN** user views footer in dark theme
- **THEN** text passes WCAG AA contrast (4.5:1) against the dark background

### Requirement: Footer is responsive on mobile and desktop

The system SHALL ensure footer content fits on 360px-width screens without horizontal scrolling. On all screen sizes, the footer SHALL remain readable and clickable.

#### Scenario: Footer fits on mobile (360px)
- **WHEN** viewport width is 360px
- **THEN** footer content (copyright + back-to-top link) displays without horizontal scrolling

#### Scenario: Back-to-top link is touch-friendly
- **WHEN** user touches the back-to-top link on a mobile device
- **THEN** link has minimum touch target size (44px recommended)

### Requirement: Footer is accessible to assistive technologies

The system SHALL mark the footer with semantic `<footer>` HTML element. The back-to-top link SHALL have an accessible label (text or `aria-label`) describing its purpose.

#### Scenario: Screen reader announces footer
- **WHEN** user navigates to the footer with a screen reader
- **THEN** footer element is announced as navigation or complementary content

#### Scenario: Back-to-top link is keyboard operable
- **WHEN** user navigates to the back-to-top link with Tab
- **THEN** link is focused and can be activated with Enter or Space
