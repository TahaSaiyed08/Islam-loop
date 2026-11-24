import { X } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

type HeaderProps = {
  percentage: number;
};

export const Header = ({ percentage }: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
      <button
        type="button"
        onClick={open}
        aria-label="Leave the lesson"
        className="rounded-md p-1 text-slate-600 transition hover:opacity-75"
      >
        <X />
      </button>

      <Progress value={percentage} aria-label="Lesson progress" />
    </header>
  );
};
