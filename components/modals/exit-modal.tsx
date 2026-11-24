"use client";

import { useRouter } from "next/navigation";

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
import { useExitModal } from "@/store/use-exit-modal";

export const ExitModal = () => {
  const router = useRouter();
  const isClient = useHydrated();
  const { isOpen, close } = useExitModal();

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-5 flex w-full items-center justify-center">
            <LogoMark className="size-20" />
          </div>

          <DialogTitle className="text-center text-2xl font-bold">
            Leave for now?
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            Your answers here will be lost. Lessons you have finished stay
            finished.
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
              Keep going
            </Button>

            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                close();
                router.push("/learn");
              }}
            >
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
