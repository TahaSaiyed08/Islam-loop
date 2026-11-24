import type { Metadata } from "next";

import { getCatalog } from "@/lib/catalog";

import { PlacementQuiz } from "./placement-quiz";

export const metadata: Metadata = {
  title: "Find my level",
  description: "A short placement quiz that suggests which tier to start at.",
};

export default function PlacementPage() {
  const catalog = getCatalog();
  const tierNames = Object.fromEntries(
    catalog.tiers.map((t) => [t.tier, t.name])
  );
  return <PlacementQuiz questions={catalog.placement} tierNames={tierNames} />;
}
