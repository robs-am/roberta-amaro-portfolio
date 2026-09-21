// Shared look of the header's bare line buttons (menu open/close and back): a hollow-capsule icon on
// a square hit area, so they stand apart from the bordered language/theme controls beside them.
export const menuButtonClass =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// The marks are drawn as hollow capsules (outlined pills): two stacked for "open", crossed for "close",
// and a shaft with two angled strokes for "back".
export function CapsuleSvg({
  children,
  className = "size-9",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
