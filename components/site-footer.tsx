import Link from "next/link";

import { BASE_REPO_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/50">
      <div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
        <span>Free and non-commercial</span>
        <span aria-hidden className="hidden sm:inline">
          ·
        </span>
        <Link
          href="/sources"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sources
        </Link>
        <span aria-hidden className="hidden sm:inline">
          ·
        </span>
        <Link
          href="/about"
          className="underline underline-offset-4 hover:text-foreground"
        >
          About
        </Link>
        <span aria-hidden className="hidden sm:inline">
          ·
        </span>
        <span>
          Based on{" "}
          <a
            href={BASE_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            sanidhyy/duolingo-clone
          </a>{" "}
          (MIT)
        </span>
      </div>
    </footer>
  );
}
