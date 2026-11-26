import { MetadataRoute } from "next";
import { getHotels } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/hotels`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const hotels = await getHotels();
    const hotelRoutes: MetadataRoute.Sitemap = hotels.map((hotel) => ({
      url: `${siteUrl}/hotels/${hotel.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...hotelRoutes];
  } catch {
    return staticRoutes;
  }
}
