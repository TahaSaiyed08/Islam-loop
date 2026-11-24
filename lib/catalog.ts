import placement from "@/content/placement.json";
import tier1 from "@/content/tier-1.json";
import tier2 from "@/content/tier-2.json";
import tier3 from "@/content/tier-3.json";
import tier4 from "@/content/tier-4.json";
import tier5 from "@/content/tier-5.json";
import tier6 from "@/content/tier-6.json";
import tier7 from "@/content/tier-7.json";
import tier8 from "@/content/tier-8.json";
import tier9 from "@/content/tier-9.json";
import tier10 from "@/content/tier-10.json";

import { type Catalog, buildCatalog } from "./content";

export const RAW_TIERS: unknown[] = [
  tier1, tier2, tier3, tier4, tier5, tier6, tier7, tier8, tier9, tier10,
];
export const RAW_PLACEMENT: unknown = placement;

let cached: Catalog | null = null;

/** Loaded once at build time; returns only PREVIEW / APPROVED lessons. */
export function getCatalog(): Catalog {
  cached ??= buildCatalog(RAW_TIERS, RAW_PLACEMENT);
  return cached;
}
