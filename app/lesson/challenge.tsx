import { scrambledOrder } from "@/lib/lesson-ui";
import type { Challenge as ChallengeData } from "@/lib/challenges";
import { cn } from "@/lib/utils";

import { Card } from "./card";
import { SourceCard } from "./source-card";

type ChallengeProps = {
  challenge: ChallengeData;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  /** SELECT: the chosen option id. */
  selectedOption?: number;
  onSelect: (id: number) => void;
  /** ORDER: item indices the learner has placed, in order. */
  placed: number[];
  onPlace: (index: number) => void;
  onUnplace: (index: number) => void;
};

export const Challenge = ({
  challenge,
  status,
  disabled,
  selectedOption,
  onSelect,
  placed,
  onPlace,
  onUnplace,
}: ChallengeProps) => {
  if (challenge.type === "SOURCE")
    return challenge.source ? <SourceCard source={challenge.source} /> : null;

  if (challenge.type === "SELECT")
    return (
      <div
        role="radiogroup"
        aria-label="Answers"
        // Options here are sentences, so one column at every width (upstream's
        // two-column grid suits single words).
        className={cn("grid grid-cols-1 gap-2")}
      >
        {challenge.options.map((option, i) => {
          const picked = selectedOption === option.id;
          // After a wrong answer the right card is shown as correct.
          const reveal = status === "wrong" && option.correct;
          return (
            <Card
              key={option.id}
              id={option.id}
              text={option.text}
              shortcut={`${i + 1}`}
              selected={picked || reveal}
              onClick={() => onSelect(option.id)}
              status={reveal ? "correct" : status}
              disabled={disabled}
              type="SELECT"
              testId={`option-${i}`}
            />
          );
        })}
      </div>
    );

  // ORDER: tap the items first to last, in the same Card style.
  const pool = scrambledOrder(challenge.items.length).filter(
    (i) => !placed.includes(i)
  );
  const checked = status !== "none";
  return (
    <div className="space-y-4">
      <div
        className="space-y-2"
        data-testid="order-answer"
        aria-label="Your order"
        role="list"
      >
        {placed.length === 0 && (
          <p className="rounded-xl border-2 border-dashed p-4 text-neutral-600">
            Nothing placed yet.
          </p>
        )}
        {placed.map((idx, pos) => (
          <Card
            key={idx}
            id={idx}
            text={challenge.items[idx]}
            badge={`${pos + 1}`}
            selected
            status={checked ? (idx === pos ? "correct" : "wrong") : "none"}
            onClick={() => onUnplace(idx)}
            disabled={disabled || checked}
            type="ORDER"
          />
        ))}
      </div>

      {!checked && (
        <div className="space-y-2" aria-label="Items to place" role="list">
          {pool.map((idx, n) => (
            <Card
              key={idx}
              id={idx}
              text={challenge.items[idx]}
              shortcut={`${n + 1}`}
              onClick={() => onPlace(idx)}
              disabled={disabled}
              type="ORDER"
              testId={`pool-${idx}`}
            />
          ))}
        </div>
      )}

      {checked && status === "wrong" && (
        <div data-testid="correct-order">
          <p className="font-bold text-neutral-700">Correct order</p>
          <ol className="mt-1 list-decimal pl-6 text-base text-neutral-700">
            {challenge.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
