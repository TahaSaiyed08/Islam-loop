import { cn } from "@/lib/utils";

/** Shown on every lesson that has not yet been approved. */
export function PreviewBadge({ className }: { className?: string }) {
  return (
    <span
      data-testid="preview-badge"
      className={cn(
        "inline-flex items-center rounded-lg border-2 border-sand-line bg-sand-soft px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-sand-ink",
        className
      )}
    >
      Preview — under review
    </span>
  );
}
