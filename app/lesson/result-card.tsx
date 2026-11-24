import { Check, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type ResultCardProps = {
  value: number | string;
  variant: "points" | "score";
  label?: string;
};

export const ResultCard = ({ value, variant, label }: ResultCardProps) => {
  const Icon = variant === "points" ? Star : Check;

  return (
    <div
      data-testid={`result-${variant}`}
      className={cn(
        "w-full rounded-2xl border-2",
        variant === "points" && "border-sand-dark bg-sand-dark",
        variant === "score" && "border-brand bg-brand"
      )}
    >
      <div
        className={cn(
          "rounded-t-xl p-1.5 text-center text-xs font-bold uppercase text-white",
          variant === "points" && "bg-sand-dark",
          variant === "score" && "bg-brand"
        )}
      >
        {label ?? (variant === "points" ? "Points earned" : "Lesson complete")}
      </div>

      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-white p-6 text-lg font-bold",
          variant === "points" && "text-sand-ink",
          variant === "score" && "text-brand"
        )}
      >
        <Icon
          aria-hidden
          className={cn(
            "mr-1.5 h-6 w-6",
            variant === "points" && "fill-sand text-sand-dark"
          )}
        />
        {value}
      </div>
    </div>
  );
};
