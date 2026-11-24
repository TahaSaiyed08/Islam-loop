import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Ported from sanidhyy/duolingo-clone (MIT): the upgrade card became "Find my level".
export const Promo = () => {
  return (
    <div className="space-y-4 rounded-2xl border-2 border-swan bg-white p-6">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Compass aria-hidden className="size-7 text-brand" />

          <h3 className="text-xl font-extrabold text-eel">Find my level</h3>
        </div>

        <p className="font-semibold text-wolf">
          A few quick questions suggest where to start. About ninety seconds.
        </p>
      </div>

      <Button variant="secondary" className="w-full" size="lg" asChild>
        <Link href="/placement" prefetch data-testid="promo-placement">
          Take the quiz
        </Link>
      </Button>
    </div>
  );
};
