import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/site";

// Ported from sanidhyy/duolingo-clone (MIT). Login and the GitHub icon are gone;
// the right side links to Sources and About.
export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-swan px-4">
      <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
        <Link
          href="/"
          prefetch
          className="flex items-center gap-x-3 pl-0 sm:pl-4"
        >
          <LogoMark className="size-10" />

          <span className="text-2xl font-extrabold tracking-wide text-brand">
            {SITE_NAME}
          </span>
        </Link>

        <nav aria-label="Main" className="flex gap-x-1 sm:gap-x-3">
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/sources">Sources</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
