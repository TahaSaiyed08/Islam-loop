"use client";

import { Flame, Star } from "lucide-react";

import { useProgress } from "@/store/use-progress";

/** Streak and points in the mobile bar (the right-hand column is desktop only). */
export const MobileStats = () => {
  const { ready, streak, points } = useProgress();
  return (
    <div className="ml-auto flex items-center gap-x-4 text-sm font-bold text-white">
      <span
        className="flex items-center gap-1"
        aria-label={`Daily streak ${ready ? streak : 0}`}
      >
        <Flame className="size-5" aria-hidden />
        <span data-testid="streak-m">{ready ? streak : 0}</span>
      </span>
      <span
        className="flex items-center gap-1"
        aria-label={`Points ${ready ? points : 0}`}
      >
        <Star className="size-5" aria-hidden />
        <span data-testid="points-m">{ready ? points : 0}</span>
      </span>
    </div>
  );
};
