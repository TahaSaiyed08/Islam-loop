"use client";

import { Check, X } from "lucide-react";

import type { Question } from "@/content/schema";
import { scrambledOrder } from "@/lib/lesson-ui";
import { cn } from "@/lib/utils";

export type Answer =
  | { kind: "select"; choice: number | null }
  | { kind: "order"; placed: number[] };

export const emptyAnswer = (q: Question): Answer =>
  q.type === "select"
    ? { kind: "select", choice: null }
    : { kind: "order", placed: [] };

export const isAnswered = (q: Question, a: Answer) =>
  q.type === "select" && a.kind === "select"
    ? a.choice !== null
    : q.type === "order" &&
      a.kind === "order" &&
      a.placed.length === q.items.length;

/** Items are stored in the correct order; `placed` holds indices into that list. */
export const isCorrect = (q: Question, a: Answer) =>
  q.type === "select" && a.kind === "select"
    ? a.choice === q.correct
    : q.type === "order" &&
      a.kind === "order" &&
      a.placed.every((idx, pos) => idx === pos);

type Props = {
  question: Question;
  answer: Answer;
  checked: boolean;
  onChange: (a: Answer) => void;
};

export function QuestionView({ question, answer, checked, onChange }: Props) {
  if (question.type === "select" && answer.kind === "select") {
    return (
      <div>
        <h2 className="text-2xl font-bold leading-snug" id="question-prompt">
          {question.prompt}
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="question-prompt"
          className="mt-6 grid gap-3"
        >
          {question.options.map((opt, i) => {
            const selected = answer.choice === i;
            const right = checked && i === question.correct;
            const wrong = checked && selected && i !== question.correct;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={checked}
                onClick={() => onChange({ kind: "select", choice: i })}
                data-testid={`option-${i}`}
                data-correct={
                  checked ? String(i === question.correct) : undefined
                }
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 text-left text-lg transition-colors",
                  !checked && "hover:bg-muted",
                  selected && !checked && "border-primary bg-primary/5",
                  right && "border-success bg-success-soft",
                  wrong && "border-danger bg-danger-soft"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border-2 text-sm font-semibold text-muted-foreground",
                    selected && !checked && "border-primary text-primary",
                    right && "border-success text-success",
                    wrong && "border-danger text-danger"
                  )}
                >
                  {right ? (
                    <Check className="size-4" />
                  ) : wrong ? (
                    <X className="size-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === "order" && answer.kind === "order") {
    const scrambled = scrambledOrder(question.items.length);
    const pool = scrambled.filter((idx) => !answer.placed.includes(idx));
    return (
      <div>
        <h2 className="text-2xl font-bold leading-snug" id="question-prompt">
          {question.prompt}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tap the items in order, first to last. Tap a placed item to take it
          back.
        </p>
        <ol
          aria-label="Your order"
          data-testid="order-answer"
          className="mt-5 grid min-h-14 gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 p-3"
        >
          {answer.placed.length === 0 && (
            <li className="px-1 py-2 text-muted-foreground">
              Nothing placed yet
            </li>
          )}
          {answer.placed.map((idx, pos) => (
            <li key={idx}>
              <button
                type="button"
                disabled={checked}
                onClick={() =>
                  onChange({
                    kind: "order",
                    placed: answer.placed.filter((x) => x !== idx),
                  })
                }
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border-2 bg-card px-3 py-2 text-left text-lg",
                  checked &&
                    (idx === pos
                      ? "border-success bg-success-soft"
                      : "border-danger bg-danger-soft")
                )}
              >
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {pos + 1}
                </span>
                {question.items[idx]}
              </button>
            </li>
          ))}
        </ol>
        {!checked && (
          <ul aria-label="Items to place" className="mt-4 grid gap-2">
            {pool.map((idx) => (
              <li key={idx}>
                <button
                  type="button"
                  data-testid={`pool-${idx}`}
                  onClick={() =>
                    onChange({ kind: "order", placed: [...answer.placed, idx] })
                  }
                  className="min-h-12 w-full rounded-lg border-2 bg-card px-3 py-2 text-left text-lg hover:bg-muted"
                >
                  {question.items[idx]}
                </button>
              </li>
            ))}
          </ul>
        )}
        {checked && !isCorrect(question, answer) && (
          <div className="mt-4">
            <p className="font-semibold">Correct order</p>
            <ol className="mt-1 list-decimal pl-6">
              {question.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }
  return null;
}
