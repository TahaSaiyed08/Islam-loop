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
        "h-full cursor-pointer rounded-[12px] border-2 border-b-4 border-swan bg-white p-4 transition-colors hover:bg-polar active:translate-y-[2px] active:border-b-2 lg:p-6",
        selected && "border-sand-line bg-sand-soft hover:bg-sand-soft",
        selected &&
          status === "correct" &&
          "animate-duo-pop border-success-line bg-success-soft hover:bg-success-soft",
        selected &&
          status === "wrong" &&
          "animate-duo-shake border-danger-line bg-danger-soft hover:bg-danger-soft",
        disabled && "pointer-events-none hover:bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-base font-semibold leading-snug text-eel lg:text-[19px]",
            selected && "text-sand-ink",
            selected && status === "correct" && "text-success",
            selected && status === "wrong" && "text-danger"
          )}
        >
          {text}
        </p>

        <div
          aria-hidden
          className={cn(
            "ml-4 flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-lg border-2 border-swan text-xs font-bold text-hare lg:h-[30px] lg:w-[30px] lg:text-[15px]",
            selected && "border-sand-line text-sand-ink",
            selected &&
              status === "correct" &&
              "border-success-line text-success",
            selected && status === "wrong" && "border-danger-line text-danger"
          )}
        >
          {badge ?? shortcut}
        </div>
      </div>
    </div>
  );
};
