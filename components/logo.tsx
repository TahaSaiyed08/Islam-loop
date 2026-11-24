import { cn } from "@/lib/utils";

/** An original geometric mark: a winding road ending in a dot. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M9 25c0-6 14-4 14-10S9 11 9 7"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-accent"
      />
      <circle cx="9" cy="7" r="2.6" className="fill-primary-foreground" />
    </svg>
  );
}
