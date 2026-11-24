import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
  /** The lesson "Continue" opens; hidden when nothing in the unit is open. */
  href?: string;
  /** Any lesson in the unit is still under review. */
  preview?: boolean;
};

export const UnitBanner = ({
  title,
  description,
  href,
  preview,
}: UnitBannerProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-4 rounded-xl bg-brand p-5 text-white">
      <div className="space-y-2.5">
        <h3 className="flex flex-wrap items-center gap-x-3 text-2xl font-bold">
          {title}
          {preview && (
            <span
              data-testid="unit-preview"
              className="rounded-full bg-brand-dark px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
            >
              Preview
            </span>
          )}
        </h3>
        <p className="text-lg">{description}</p>
      </div>

      {href && (
        <Link href={href} prefetch className="shrink-0">
          <Button
            size="lg"
            variant="secondary"
            className="hidden border-2 border-b-4 active:border-b-2 xl:flex"
          >
            <NotebookText className="mr-2" />
            Continue
          </Button>
        </Link>
      )}
    </div>
  );
};
