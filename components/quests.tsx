import { Trophy } from "lucide-react";

import { Progress } from "@/components/ui/progress";

type TierCardProps = {
  tier: number;
  name: string;
  /** Lessons finished and lessons open in this tier. */
  done: number;
  open: number;
  /** The checkpoint ends the tier. */
  checkpointDone: boolean;
  hasCheckpoint: boolean;
};

// Ported from sanidhyy/duolingo-clone (MIT): the Quests card became "Your tier".
export const TierCard = ({
  tier,
  name,
  done,
  open,
  checkpointDone,
  hasCheckpoint,
}: TierCardProps) => {
  const progress = open === 0 ? 0 : (done / open) * 100;

  return (
    <div
      className="space-y-4 rounded-xl border-2 bg-white p-4"
      data-testid="tier-card"
    >
      <div className="flex w-full items-center justify-between space-y-2">
        <h3 className="text-lg font-bold">Your tier</h3>
      </div>

      <ul className="w-full space-y-4">
        <li className="flex w-full items-center gap-x-3 pb-4">
          <Trophy aria-hidden className="size-10 shrink-0 text-sand-dark" />

          <div className="flex w-full flex-col gap-y-2">
            <p className="text-sm font-bold text-neutral-700">
              Tier {tier} · {name}
            </p>

            <Progress
              value={progress}
              className="h-2"
              aria-label="Tier progress"
            />
            <p className="text-sm text-neutral-600">
              {done} of {open} lessons finished
              {hasCheckpoint &&
                (checkpointDone
                  ? ". Checkpoint passed."
                  : ". Checkpoint ahead.")}
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};
