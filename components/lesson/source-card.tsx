import { ExternalLink } from "lucide-react";

import type { Source } from "@/content/schema";
import { citation } from "@/lib/lesson-ui";

export function SourceCard({
  source,
  label,
}: {
  source: Source;
  label?: string;
}) {
  return (
    <figure
      className="rounded-xl border bg-card p-5 shadow-sm sm:p-7"
      data-testid="source-card"
    >
      {label && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <blockquote className="border-l-4 border-accent pl-4 font-quote text-xl leading-relaxed sm:text-2xl">
        <p>{source.quote}</p>
      </blockquote>
      <figcaption className="mt-4 space-y-2 text-base text-muted-foreground">
        <p data-testid="citation">{citation(source)}</p>
        {source.key === "QURAN" && (
          <p>
            Qara&apos;i translation, via{" "}
            <a
              href="https://tanzil.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              Tanzil
            </a>
          </p>
        )}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline underline-offset-4"
        >
          Read the full text
          <ExternalLink className="size-4" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
