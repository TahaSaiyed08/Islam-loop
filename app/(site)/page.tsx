import Link from "next/link";
import { BookOpenCheck, Compass, Footprints, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog";
import { SITE_TAGLINE } from "@/lib/site";

const HOW = [
  {
    icon: BookOpenCheck,
    title: "Start with the source",
    text: "Each lesson is built around one short quote, shown with its book, its place in the book and its translator, plus a link to read more.",
  },
  {
    icon: Compass,
    title: "Answer two or three questions",
    text: "Pick the best answer or put steps in order. If you miss one, you see the right answer and why. There are no lives and no penalties.",
  },
  {
    icon: Footprints,
    title: "Follow the path",
    text: "Ten tiers lead from how meaning is built to questions we face today. Your progress stays in your own browser.",
  },
];

export default function Home() {
  const catalog = getCatalog();
  const ready = catalog.lessons.length;
  return (
    <>
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
        <div className="container py-14 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
              {SITE_TAGLINE}
            </h1>
            <p className="mt-5 text-xl text-muted-foreground">
              Free, short lessons. Every quote sourced.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/placement" data-testid="cta-placement">
                  Find my level
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/learn" data-testid="cta-start">
                  Start from the beginning
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-base text-muted-foreground">
              No account, no ads, nothing to buy.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16" aria-labelledby="how">
        <h2 id="how" className="text-3xl font-bold">
          How a lesson works
        </h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {HOW.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-xl border bg-card p-6">
              <Icon className="size-7 text-primary" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container pb-4" aria-labelledby="tiers">
        <h2 id="tiers" className="text-3xl font-bold">
          Ten tiers
        </h2>
        <p className="mt-2 text-muted-foreground">
          {ready} lessons are open today. The rest appear as each quote is
          checked against its source.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {catalog.tiers.map((t) => {
            const open = t.lessons.length;
            return (
              <li
                key={t.tier}
                className="flex items-baseline gap-4 rounded-xl border bg-card px-5 py-4"
              >
                <span className="text-2xl font-bold text-primary">
                  {t.tier}
                </span>
                <span className="flex-1 font-semibold">{t.name}</span>
                <span className="text-sm text-muted-foreground">
                  {open} of {t.total} open
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="container py-16" aria-labelledby="checked">
        <div className="flex max-w-3xl gap-4 rounded-xl border bg-card p-6">
          <Link2 className="mt-1 size-7 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 id="checked" className="text-2xl font-bold">
              Quotes are copied, then checked
            </h2>
            <p className="mt-2 text-muted-foreground">
              A quote is never typed from memory or reworded. A checker looks
              each one up in its source, word for word. If it does not match,
              the lesson stays hidden.
            </p>
            <Link
              href="/sources"
              className="mt-3 inline-block font-semibold text-primary underline underline-offset-4"
            >
              See the sources and how they are used
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
