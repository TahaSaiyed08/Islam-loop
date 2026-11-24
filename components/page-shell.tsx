import { cn } from "@/lib/utils";

/** Page content aligned to the header's left edge, with a readable line length. */
export function PageShell({
  narrow = false,
  children,
}: {
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="container py-10">
      <div className={cn(narrow ? "max-w-2xl" : "max-w-3xl")}>{children}</div>
    </div>
  );
}
