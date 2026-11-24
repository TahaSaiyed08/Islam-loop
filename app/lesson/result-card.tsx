import { Check, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type ResultCardProps = {
  value: number | string;
  variant: "points" | "score";
  label?: string;
};

// Ported from sanidhyy/duolingo-clone (MIT): coloured frame, label band, white
// panel with an icon and the value. Variants are points and score.
export const ResultCard = ({ value, variant, label }: ResultCardProps) => {
  const Icon = variant === "points" ? Star : Check;

  return (
    <div
      data-testid={`result-${variant}`}
      className={cn(
        "w-full rounded-2xl border-2",
        variant === "points" && "border-sand bg-sand",
        variant === "score" && "border-brand bg-brand"
      )}
    >
      <div
        className={cn(
          "rounded-t-xl p-1.5 text-center text-xs font-extrabold uppercase tracking-wide",
          variant === "points" && "bg-sand text-accent-foreground",
          variant === "score" && "bg-brand text-white"
        )}
      >
        {label ?? (variant === "points" ? "Points earned" : "Lesson complete")}
      </div>

      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-white p-6 text-xl font-extrabold",
          variant === "points" && "text-sand-ink",
          variant === "score" && "text-brand"
        )}
      >
        <Icon
          aria-hidden
          className={cn(
            "mr-1.5 h-7 w-7",
            variant === "points" && "fill-sand text-sand-dark",
            variant === "score" && "stroke-[3.5]"
          )}
        />
        {value}
      </div>
    </div>
  );
};
