import { cn } from "@/lib/utils";

/** Shown on every lesson that has not yet been approved. */
export function PreviewBadge({ className }: { className?: string }) {
  return (
    <span
      data-testid="preview-badge"
      className={cn(
        "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground",
        className
      )}
    >
      Preview — under review
    </span>
  );
}
