import type { Metadata } from "next";

import { getCatalog } from "@/lib/catalog";

import { LearnView, type LearnTier } from "./learn-view";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "The full path: ten tiers of short, sourced lessons on the Qur'an and the Prophet's family.",
};

export default function LearnPage() {
  const tiers: LearnTier[] = getCatalog().tiers.map((t) => ({
    tier: t.tier,
    name: t.name,
    total: t.total,
    units: t.units.map((u) => ({
      unit: u.unit,
      name: u.name,
      lessons: u.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        isCheckpoint: l.isCheckpoint,
        status: l.status as "PREVIEW" | "APPROVED",
      })),
    })),
  }));
  return <LearnView tiers={tiers} />;
}
