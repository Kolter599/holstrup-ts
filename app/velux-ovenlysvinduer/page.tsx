import type { Metadata } from "next";
import { Longform } from "../_components/Longform";
import { VELUX_CONTENT } from "@/lib/longform-velux";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: VELUX_CONTENT.metaTitle,
  description: VELUX_CONTENT.metaDescription,
  alternates: { canonical: VELUX_CONTENT.path },
  openGraph: {
    url: `${SITE.url}${VELUX_CONTENT.path}`,
    title: VELUX_CONTENT.metaTitle,
    description: VELUX_CONTENT.metaDescription,
    images: [{ url: VELUX_CONTENT.hero }],
  },
};

export default function VeluxPage() {
  return <Longform content={VELUX_CONTENT} />;
}
