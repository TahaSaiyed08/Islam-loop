import Link from "next/link";

import { BASE_REPO_URL } from "@/lib/site";

export const Footer = () => {
  return (
    <div className="w-full border-t-2 border-swan p-4">
      <div className="mx-auto flex max-w-screen-lg flex-col items-center gap-2 text-sm text-wolf sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3">
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
    </div>
  );
};
