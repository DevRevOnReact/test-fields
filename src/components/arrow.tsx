export function Arrow({
  direction = "right",
  className = "",
}: {
  direction?: "left" | "right" | "up-right";
  className?: string;
}) {
  const rotation =
    direction === "left" ? "rotate-180" : direction === "up-right" ? "-rotate-45" : "";
  return (
    <svg
      className={`size-4 shrink-0 ${rotation} ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 10h13M10 4l6 6-6 6" />
    </svg>
  );
}
