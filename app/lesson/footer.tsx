"use client";

import { Check, X } from "lucide-react";
import { useKey } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  /** Button text while status is "none" (default "Check"). */
  label?: string;
  /** The one-line reason, shown in the coloured bar after checking. */
  explanation?: string | null;
  /** Second button on the finish screen. */
  onPractice?: () => void;
  practiceLabel?: string;
  /** Button text on the finish screen (default "Continue"). */
  doneLabel?: string;
};

// Ported from sanidhyy/duolingo-clone (MIT). Same Check / Continue flow, coloured
// bars and Enter shortcut; the feedback reads like the real app: an icon disc, a
// bold verdict and the reason underneath. No hearts, no penalty.
export const Footer = ({
  onCheck,
  status,
  disabled,
  label = "Check",
  explanation,
  onPractice,
  practiceLabel = "Practise again",
  doneLabel = "Continue",
}: FooterProps) => {
  // Enter does what the button does, unless a button or link already has focus
  // (the browser clicks it itself, so handling it here would fire twice).
  useKey(
    "Enter",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "BUTTON" || t.tagName === "A")) return;
      if (!disabled) onCheck();
    },
    {},
    [onCheck, disabled]
  );

  const checked = status === "correct" || status === "wrong";

  return (
    <footer
      data-testid="footer"
      data-status={status}
      className={cn(
        "sticky bottom-0 border-t-2 border-swan bg-white lg:min-h-[140px]",
        status === "correct" && "border-transparent bg-success-soft",
        status === "wrong" && "border-transparent bg-danger-soft"
      )}
    >
      <div className="mx-auto flex min-h-[100px] max-w-[1000px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:min-h-[140px] lg:px-10">
        {checked && (
          <div
            className="animate-duo-slide-up flex items-center gap-x-4"
            role="status"
          >
            <div
              aria-hidden
              className="hidden size-20 shrink-0 items-center justify-center rounded-full bg-white sm:flex"
            >
              {status === "correct" ? (
                <Check className="size-10 stroke-[3.5] text-success" />
              ) : (
                <X className="size-10 stroke-[3.5] text-danger" />
              )}
            </div>
            <div
              className={status === "correct" ? "text-success" : "text-danger"}
            >
              <p
                data-testid="footer-message"
                className="text-xl font-extrabold lg:text-[24px] lg:leading-[30px]"
              >
                {status === "correct"
                  ? "Well done."
                  : "The correct answer is shown above."}
              </p>
              {explanation && (
                <p
                  data-testid="explanation"
                  className="mt-1 text-base font-semibold"
                >
                  {explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {status === "completed" && onPractice && (
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onPractice}
            data-testid="practise-again"
          >
            {practiceLabel}
          </Button>
        )}

        {/* key: a fresh button for each state, so colours never animate between states */}
        <Button
          key={status}
          disabled={disabled}
          aria-disabled={disabled}
          className="w-full text-[17px] sm:ml-auto sm:w-auto sm:min-w-[150px]"
          onClick={onCheck}
          size="lg"
          variant={status === "wrong" ? "danger" : "secondary"}
          data-testid={
            status === "none" && label === "Check" ? "check" : "continue"
          }
        >
          {status === "none" && label}
          {checked && "Continue"}
          {status === "completed" && doneLabel}
        </Button>
      </div>
    </footer>
  );
};
