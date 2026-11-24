import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { LearnPath, type PathTierData } from "@/components/learn/learn-path";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "The full path: ten tiers of short, sourced lessons on the Qur'an and the Prophet's family.",
};

export default function LearnPage() {
  const catalog = getCatalog();
  const tiers: PathTierData[] = catalog.tiers.map((t) => ({
    tier: t.tier,
    name: t.name,
    total: t.total,
    units: t.units.map((u) => ({
      unit: u.unit,
      name: u.name,
      lessons: u.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        mechanic: l.mechanic,
        isCheckpoint: l.isCheckpoint,
        status: l.status as "PREVIEW" | "APPROVED",
      })),
    })),
  }));
  return (
    <PageShell>
      <h1 className="text-4xl font-bold leading-tight">Your path</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Lessons open one after another. A tier opens when you pass the
        checkpoint before it, or when the placement quiz starts you further on.
      </p>
      <div className="mt-10">
        <LearnPath tiers={tiers} />
      </div>
    </PageShell>
  );
}
