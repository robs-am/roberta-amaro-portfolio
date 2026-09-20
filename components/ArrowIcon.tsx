export function ArrowIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className ?? "size-3.5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}
