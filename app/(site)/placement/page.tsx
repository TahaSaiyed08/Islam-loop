import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";
import { PlacementQuiz } from "@/components/learn/placement-quiz";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Find my level",
  description: "A short placement quiz that suggests which tier to start at.",
};

export default function PlacementPage() {
  const catalog = getCatalog();
  const tierNames = Object.fromEntries(
    catalog.tiers.map((t) => [t.tier, t.name])
  );
  return (
    <PageShell narrow>
      <PlacementQuiz questions={catalog.placement} tierNames={tierNames} />
    </PageShell>
  );
}
