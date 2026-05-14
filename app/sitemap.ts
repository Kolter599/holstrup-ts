import type { MetadataRoute } from "next";
import { AREAS, SERVICES, SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/ydelser`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/omraader`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/projekter`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/om`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/kontakt`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const services: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${base}/ydelser/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const cities: MetadataRoute.Sitemap = AREAS.map((a) => ({
    url: `${base}/tomrer-${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: a.tier === "core" ? 0.85 : 0.75,
  }));

  // Blog hidden from public site for now — exclude from sitemap so Google
  // doesn't index it. Keep getAllPosts() available for when we re-enable it.
  void getAllPosts;

  return [...staticEntries, ...services, ...cities];
}
