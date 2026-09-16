import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * /blog var tidligere spærret her. Det holdt Google ude fra bl.a.
 * "hvad koster nyt tag 2026" — en af de mest købsklare søgninger i branchen.
 * Kun /api og admin er lukket nu.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin-invisu"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
