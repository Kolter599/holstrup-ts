import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description:
      "Tømrer- og snedkerfirma i Frederikssund med 30+ års erfaring. Tag, tilbygning, renovering og hovedentrepriser i Nordsjælland.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1347a6",
    lang: "da",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  };
}
