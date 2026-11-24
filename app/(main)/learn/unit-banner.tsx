import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { UnitTheme } from "@/lib/unit-theme";
import { cn } from "@/lib/utils";

type UnitBannerProps = {
  /** Small label above the title, e.g. "Tier 1 · Unit 1". */
  label: string;
  title: string;
  /** The lesson "Continue" opens; hidden when nothing in the unit is open. */
  href?: string;
  /** Any lesson in the unit is still under review. */
  preview?: boolean;
  theme: UnitTheme;
};

// Ported from sanidhyy/duolingo-clone (MIT): coloured banner with title and a
// Continue button. Colour comes from the unit theme; the label line and the
// guidebook-style outlined button follow the real app's banner.
export const UnitBanner = ({
  label,
  title,
  href,
  preview,
  theme,
}: UnitBannerProps) => {
  return (
    <div
      data-testid="unit-banner"
      className={cn(
        "flex w-full items-center justify-between gap-x-4 rounded-2xl border-b-4 p-5 text-white",
        theme.banner
      )}
    >
      <div className="space-y-1.5">
        <p className="flex flex-wrap items-center gap-x-3 text-[15px] font-extrabold uppercase tracking-wide">
          {label}
          {preview && (
            <span
              data-testid="unit-preview"
              className="rounded-lg bg-black/25 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide"
            >
              Preview
            </span>
          )}
        </p>
        <h3 className="text-[22px] font-extrabold leading-tight">{title}</h3>
      </div>

      {href && (
        <Link href={href} prefetch className="shrink-0">
          <Button
            size="lg"
            variant="secondary"
            tabIndex={-1}
            className="hidden border-2 border-b-4 border-black/20 bg-transparent px-4 hover:bg-white/10 active:border-b-2 active:border-t-2 xl:flex"
          >
            <NotebookText className="mr-2" />
            Continue
          </Button>
        </Link>
      )}
    </div>
  );
};
