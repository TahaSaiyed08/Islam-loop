import { ExternalLink } from "lucide-react";

import type { Source } from "@/content/schema";
import { citation } from "@/lib/lesson-ui";

// The SOURCE challenge: a large card with the quote, its citation and a link.
export const SourceCard = ({ source }: { source: Source }) => {
  return (
    <figure
      data-testid="source-card"
      className="rounded-xl border-2 border-b-4 bg-white p-4 lg:p-6"
    >
      <blockquote className="border-l-4 border-sand pl-4 font-quote text-xl leading-relaxed text-neutral-800 lg:text-2xl">
        <p>{source.quote}</p>
      </blockquote>
      <figcaption className="mt-4 space-y-2 text-base text-neutral-600">
        <p data-testid="citation">{citation(source)}</p>
        {source.key === "QURAN" && (
          <p>
            Qara&apos;i translation, via{" "}
            <a
              href="https://tanzil.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline underline-offset-4"
            >
              Tanzil
            </a>
          </p>
        )}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline underline-offset-4"
        >
          Read the full text
          <ExternalLink className="size-4" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
};
