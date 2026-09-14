import type { MetadataRoute } from "next";

import { studyCatalog } from "@/lib/study-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://estudiobiblico-black.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date(
    studyCatalog.map((entry) => entry.updatedAt).sort().at(-1) ?? "2026-09-14",
  );

  return [
    {
      url: siteUrl,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/metodologia`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/fuentes`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...studyCatalog.map((entry) => ({
      url: `${siteUrl}/estudio/${entry.bookSlug}/${entry.chapter}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
