import { focusRing } from "./styles";

export function ArrowButton({
  direction,
  label,
  onClick,
}: Readonly<{ direction: "previous" | "next"; label: string; onClick: () => void }>) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-elevated text-foreground transition-colors hover:text-accent ${focusRing}`}
    >
      <svg
        viewBox="0 0 16 16"
        className={`size-4 ${direction === "previous" ? "" : "-scale-x-100"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 3 5 8l5 5" />
      </svg>
    </button>
  );
}
