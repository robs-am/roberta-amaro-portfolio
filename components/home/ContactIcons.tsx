// `badge` draws the circular badge around the glyph (default); without it only the glyph is drawn, scaled up to fill the icon.
type IconProps = { className?: string; badge?: boolean };

function Svg({ className, children }: Readonly<{ className: string; children: React.ReactNode }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Scales a glyph about the icon's center.
function Scaled({ scale, children }: Readonly<{ scale: number; children: React.ReactNode }>) {
  return <g transform={`translate(12 12) scale(${scale}) translate(-12 -12)`}>{children}</g>;
}

// Tabler Icons (MIT), same circular badge treatment as the brand marks below for a consistent row.
export function EmailIcon({ className = "size-11", badge = true }: IconProps) {
  return (
    <Svg className={className}>
      {badge && <circle cx="12" cy="12" r="10" />}
      <Scaled scale={badge ? 0.7 : 1}>
        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
        <path d="M3 7l9 6l9 -6" />
      </Scaled>
    </Svg>
  );
}

// Outline brand marks (Tabler Icons, MIT) — official logos only ship filled; this is the stroke rendition.
// Both get the same circular badge so the octocat (which has no natural container) reads clearly, like the LinkedIn mark's square does.
export function GithubIcon({ className = "size-11", badge = true }: IconProps) {
  return (
    <Svg className={className}>
      {badge && <circle cx="12" cy="12" r="10" />}
      <Scaled scale={badge ? 0.62 : 1}>
        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
      </Scaled>
    </Svg>
  );
}

export function LinkedinIcon({ className = "size-11", badge = true }: IconProps) {
  return (
    <Svg className={className}>
      {badge && <circle cx="12" cy="12" r="10" />}
      <Scaled scale={badge ? 1 : 1.5}>
        <path d="M8 11v5" />
        <path d="M8 8v.01" />
        <path d="M12 16v-5" />
        <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      </Scaled>
    </Svg>
  );
}
