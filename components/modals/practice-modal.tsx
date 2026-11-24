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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-5 flex w-full items-center justify-center">
            <LogoMark className="size-24" />
          </div>

          <DialogTitle className="text-center text-2xl font-bold">
            Practice lesson
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            You have already finished this lesson. Practise as often as you
            like. Points still count, and nothing is ever taken away.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mb-4">
          <div className="flex w-full flex-col gap-y-4">
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
