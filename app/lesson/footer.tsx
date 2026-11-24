"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  /** Button text while status is "none" (default "Check"). */
  label?: string;
  /** Second button on the finish screen. */
  onPractice?: () => void;
  practiceLabel?: string;
  /** Button text on the finish screen (default "Continue"). */
  doneLabel?: string;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  label = "Check",
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
  const isMobile = useMedia("(max-width: 1024px)", false);

  return (
    <footer
      data-testid="footer"
      data-status={status}
      className={cn(
        "sticky bottom-0 min-h-[100px] border-t-2 bg-background lg:h-[140px]",
        status === "correct" && "border-transparent bg-success-soft",
        status === "wrong" && "border-transparent bg-danger-soft"
      )}
    >
      <div className="mx-auto flex h-full min-h-[100px] max-w-[1140px] items-center justify-between gap-x-4 px-6 lg:px-10">
        {status === "correct" && (
          <div
            role="status"
            data-testid="footer-message"
            className="flex items-center text-base font-bold text-success lg:text-2xl"
          >
            <CheckCircle className="mr-4 h-6 w-6 shrink-0 lg:h-10 lg:w-10" />
            Well done.
          </div>
        )}

        {status === "wrong" && (
          <div
            role="status"
            data-testid="footer-message"
            className="flex items-center text-base font-bold text-danger lg:text-2xl"
          >
            <XCircle className="mr-4 h-6 w-6 shrink-0 lg:h-10 lg:w-10" />
            The correct answer is shown above.
          </div>
        )}

        {status === "completed" && onPractice && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
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
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
          data-testid={
            status === "none" && label === "Check" ? "check" : "continue"
          }
        >
          {status === "none" && label}
          {(status === "correct" || status === "wrong") && "Continue"}
          {status === "completed" && doneLabel}
        </Button>
      </div>
    </footer>
  );
};
