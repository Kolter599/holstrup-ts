import type { Metadata } from "next";
import { Longform } from "../_components/Longform";
import { VELUX_FREDERIKSSUND_CONTENT } from "@/lib/longform-velux-frederikssund";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: VELUX_FREDERIKSSUND_CONTENT.metaTitle,
  description: VELUX_FREDERIKSSUND_CONTENT.metaDescription,
  alternates: { canonical: VELUX_FREDERIKSSUND_CONTENT.path },
  openGraph: {
    url: `${SITE.url}${VELUX_FREDERIKSSUND_CONTENT.path}`,
    title: VELUX_FREDERIKSSUND_CONTENT.metaTitle,
    description: VELUX_FREDERIKSSUND_CONTENT.metaDescription,
    images: [{ url: VELUX_FREDERIKSSUND_CONTENT.hero }],
  },
};

export default function VeluxFrederikssundPage() {
  return <Longform content={VELUX_FREDERIKSSUND_CONTENT} />;
}
