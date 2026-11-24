import type { MetadataRoute } from "next";

import { getCatalog } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/learn", "/placement", "/sources", "/about"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const lessons = getCatalog().lessons.map((l) => ({
    url: `${base}/lesson/${l.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...pages, ...lessons];
}
