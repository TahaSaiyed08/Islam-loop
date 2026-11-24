import Link from "next/link";

import { HeroIllustration } from "@/components/hero-illustration";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center justify-center gap-2 p-4 lg:flex-row">
      <div className="relative mb-8 h-[240px] w-[240px] lg:mb-0 lg:h-[424px] lg:w-[424px]">
        <HeroIllustration className="size-full" />
      </div>

      <div className="flex flex-col items-center gap-y-8">
        <div className="space-y-3 text-center">
          <h1 className="max-w-[480px] text-xl font-bold text-neutral-700 lg:text-3xl">
            Learn Islam through the Qur&apos;an and the teachings of the Prophet
            and his family.
          </h1>
          <p className="text-base text-neutral-600 lg:text-lg">
            Free, short lessons. Every quote sourced.
          </p>
        </div>

        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          <Button size="lg" variant="secondary" className="w-full" asChild>
            <Link href="/placement" prefetch data-testid="cta-placement">
              Find my level
            </Link>
          </Button>

          <Button
            size="lg"
            variant="primaryOutline"
            className="w-full border-2 border-b-4 border-slate-200"
            asChild
          >
            <Link href="/learn" prefetch data-testid="cta-start">
              Start from the beginning
            </Link>
          </Button>

          <p className="text-sm text-neutral-600">
            No account, no ads, nothing to buy.
          </p>
        </div>
      </div>
    </div>
  );
}
