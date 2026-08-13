import type { MetadataRoute } from "next";
import { getLiveCompetitions } from "@/lib/data/competitions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const competitions = await getLiveCompetitions().catch(() => []);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/competitions`, changeFrequency: "hourly", priority: 0.9 },
    ...competitions.map((c) => ({
      url: `${siteUrl}/competitions/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
