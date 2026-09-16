import type { Metadata } from "next";
import { Longform } from "../../_components/Longform";
import { HAEVET_TERRASSE_CONTENT } from "@/lib/longform-haevet-terrasse";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: HAEVET_TERRASSE_CONTENT.metaTitle,
  description: HAEVET_TERRASSE_CONTENT.metaDescription,
  alternates: { canonical: HAEVET_TERRASSE_CONTENT.path },
  openGraph: {
    url: `${SITE.url}${HAEVET_TERRASSE_CONTENT.path}`,
    title: HAEVET_TERRASSE_CONTENT.metaTitle,
    description: HAEVET_TERRASSE_CONTENT.metaDescription,
    images: [{ url: HAEVET_TERRASSE_CONTENT.hero }],
  },
};

export default function HaevetTerrassePage() {
  return <Longform content={HAEVET_TERRASSE_CONTENT} />;
}
