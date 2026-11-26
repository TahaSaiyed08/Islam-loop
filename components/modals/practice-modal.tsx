"use client";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHydrated } from "@/lib/use-hydrated";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
  const isClient = useHydrated();
  const { isOpen, close } = usePracticeModal();

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-[400px] rounded-[20px] p-8 sm:rounded-[20px]">
        <DialogHeader className="space-y-3">
          <div className="mb-3 flex w-full items-center justify-center">
            <LogoMark className="size-24" />
          </div>

          <DialogTitle className="text-center text-[22px] font-extrabold leading-[28px] text-eel">
            Practice lesson
          </DialogTitle>

          <DialogDescription className="text-center text-base font-semibold text-wolf">
            You have already finished this lesson. Practise as often as you
            like. Points still count, and nothing is ever taken away.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <div className="flex w-full flex-col gap-y-3">
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              onClick={close}
            >
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
