import type { MetadataRoute } from "next";
import { AREAS, SERVICES, SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { LASTMOD } from "@/lib/lastmod";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

/**
 * lastModified kommer fra lib/lastmod.ts, som genereres ud fra git-historikken
 * med `npm run lastmod` og committes i repoet. Bevidst ikke `new Date()`: det
 * gav alle 39 URL'er dagens dato ved hvert eneste deploy, og et lastmod der
 * altid er "i dag" er præcis det signal Google lærer at ignorere.
 *
 * Bysiderne deler dato, fordi deres tekst genereres af buildCityContent().
 * Ændres generatoren, ændrer alle 20 sider sig faktisk — så det er korrekt.
 * Ydelsessider dateres derimod pr. entry i service-content.ts.
 *
 * Mangler en rute i kortet, udelades <lastmod> for netop den.
 */
function entry(path: string, changeFrequency: Freq, priority: number) {
  const lastModified = LASTMOD[path];
  return {
    url: `${SITE.url}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", "monthly", 1),
    entry("/ydelser", "monthly", 0.9),
    entry("/omraader", "monthly", 0.85),
    entry("/projekter", "monthly", 0.8),
    entry("/om", "yearly", 0.7),
    entry("/kontakt", "yearly", 0.7),
    entry("/cookies", "yearly", 0.2),
  ];

  const services = SERVICES.map((s) => entry(`/ydelser/${s.slug}`, "monthly", 0.85));

  // Langform-siderne. Prioritet på niveau med ydelsessiderne — de er skrevet
  // til at bære en søgning alene, ikke til at støtte en anden side.
  const longform: MetadataRoute.Sitemap = [
    entry("/velux-ovenlysvinduer", "monthly", 0.9),
    entry("/velux-udskiftning-pris", "monthly", 0.85),
    entry("/velux-frederikssund", "monthly", 0.85),
    entry("/traeterrasse-frederikssund", "monthly", 0.85),
    entry("/traeterrasse-egedal", "monthly", 0.8),
    entry("/guides/haevet-terrasse", "monthly", 0.8),
  ];

  const cities = AREAS.map((a) =>
    entry(`/tomrer-${a.slug}`, "monthly", a.tier === "core" ? 0.85 : 0.75)
  );

  // Blog hidden from public site for now — exclude from sitemap so Google
  // doesn't index it. Keep getAllPosts() available for when we re-enable it.
  void getAllPosts;

  return [...staticEntries, ...services, ...longform, ...cities];
}
