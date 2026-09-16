import type { Metadata } from "next";
import { Longform } from "../_components/Longform";
import { VELUX_PRIS_CONTENT } from "@/lib/longform-velux";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: VELUX_PRIS_CONTENT.metaTitle,
  description: VELUX_PRIS_CONTENT.metaDescription,
  alternates: { canonical: VELUX_PRIS_CONTENT.path },
  openGraph: {
    url: `${SITE.url}${VELUX_PRIS_CONTENT.path}`,
    title: VELUX_PRIS_CONTENT.metaTitle,
    description: VELUX_PRIS_CONTENT.metaDescription,
    images: [{ url: VELUX_PRIS_CONTENT.hero }],
  },
};

export default function VeluxPrisPage() {
  return <Longform content={VELUX_PRIS_CONTENT} />;
}
