import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { ProgressBadges } from "@/components/progress-badges";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/learn", label: "Learn" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md"
          aria-label={`${SITE_NAME} home`}
        >
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav
          aria-label="Main"
          className="order-3 flex w-full gap-1 sm:order-none sm:w-auto"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <ProgressBadges />
      </div>
    </header>
  );
}
