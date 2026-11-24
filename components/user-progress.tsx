"use client";

import { Flame, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/store/use-progress";

// Ported from sanidhyy/duolingo-clone (MIT): the same row of ghost buttons.
// Course picker and hearts are gone; the streak and points come from the ProgressStore.
export const UserProgress = () => {
  const { ready, streak, points } = useProgress();

  return (
    <div
      className="flex w-full items-center justify-between gap-x-2"
      data-testid="stats"
    >
      <Button variant="ghost" className="cursor-default text-sand-ink">
        <Flame aria-hidden className="mr-2 size-7 fill-sand text-sand-dark" />
        <span data-testid="streak">{ready ? streak : 0}</span>
        <span className="ml-1 normal-case">day streak</span>
      </Button>

      <Button variant="ghost" className="cursor-default text-sand-ink">
        <Star aria-hidden className="mr-2 size-7 fill-sand text-sand-dark" />
        <span data-testid="points">{ready ? points : 0}</span>
        <span className="ml-1 normal-case">points</span>
      </Button>
    </div>
  );
};
