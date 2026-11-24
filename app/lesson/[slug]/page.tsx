import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalog } from "@/lib/catalog";
import { SITE_NAME, siteUrl } from "@/lib/site";

import { Quiz } from "../quiz";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCatalog().lessons.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getCatalog().bySlug.get(slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} (Lesson ${lesson.slug})`,
    description: lesson.objective,
    alternates: { canonical: `/lesson/${lesson.slug}` },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const catalog = getCatalog();
  const lesson = catalog.bySlug.get(slug);
  if (!lesson) notFound();

  const idx = catalog.lessons.findIndex((l) => l.slug === slug);
  const nextSlug = catalog.lessons[idx + 1]?.slug ?? null;
  const tier = catalog.tiers.find((t) => t.tier === lesson.tier);
  const tierName = `Tier ${lesson.tier} · ${tier?.name ?? ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.objective,
    url: `${siteUrl()}/lesson/${lesson.slug}`,
    learningResourceType: "Lesson",
    educationalLevel: tierName,
    inLanguage: "en",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Course",
      name: SITE_NAME,
      url: siteUrl(),
      provider: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Quiz lesson={lesson} nextSlug={nextSlug} tierName={tierName} />
    </>
  );
}
