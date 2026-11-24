import { useCallback, type KeyboardEvent } from "react";

import { useKey } from "react-use";

import { cn } from "@/lib/utils";

// Ported from sanidhyy/duolingo-clone (MIT): audio and images removed, colours
// mapped to the theme, keyboard access added (role, tabIndex, Space).
type CardProps = {
  id: number;
  text: string;
  /** Number key that picks this card. Omit for cards with no shortcut. */
  shortcut?: string;
  /** What the badge shows; defaults to the shortcut. */
  badge?: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  type: "SELECT" | "ORDER";
  testId?: string;
};

export const Card = ({
  text,
  shortcut,
  badge,
  selected,
  onClick,
  status,
  disabled,
  type,
  testId,
}: CardProps) => {
  const handleClick = useCallback(() => {
    if (disabled) return;

    onClick();
  }, [disabled, onClick]);

  useKey(shortcut ?? "", () => shortcut && handleClick(), {}, [
    handleClick,
    shortcut,
  ]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role={type === "SELECT" ? "radio" : "button"}
      aria-checked={type === "SELECT" ? !!selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      onClick={handleClick}
      data-testid={testId}
      data-status={selected ? status : undefined}
      className={cn(
        "h-full cursor-pointer rounded-xl border-2 border-b-4 bg-white p-4 hover:bg-black/5 active:border-b-2 lg:p-6",
        selected && "border-brand/40 bg-brand/10 hover:bg-brand/10",
        selected &&
          status === "correct" &&
          "border-success/50 bg-success-soft hover:bg-success-soft",
        selected &&
          status === "wrong" &&
          "border-danger/50 bg-danger-soft hover:bg-danger-soft",
        disabled && "pointer-events-none hover:bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-base text-neutral-700 lg:text-lg",
            selected && "text-brand",
            selected && status === "correct" && "text-success",
            selected && status === "wrong" && "text-danger"
          )}
        >
          {text}
        </p>

        <div
          aria-hidden
          className={cn(
            "ml-4 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-lg border-2 text-xs font-semibold text-neutral-500 lg:h-[30px] lg:w-[30px] lg:text-[15px]",
            selected && "border-brand/50 text-brand",
            selected && status === "correct" && "border-success text-success",
            selected && status === "wrong" && "border-danger text-danger"
          )}
        >
          {badge ?? shortcut}
        </div>
      </div>
    </div>
  );
};
