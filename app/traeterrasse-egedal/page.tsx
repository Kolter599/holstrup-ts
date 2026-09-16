import type { Metadata } from "next";
import { Longform } from "../_components/Longform";
import { TERRASSE_EGEDAL } from "@/lib/longform-terrasse";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: TERRASSE_EGEDAL.metaTitle,
  description: TERRASSE_EGEDAL.metaDescription,
  alternates: { canonical: TERRASSE_EGEDAL.path },
  openGraph: {
    url: `${SITE.url}${TERRASSE_EGEDAL.path}`,
    title: TERRASSE_EGEDAL.metaTitle,
    description: TERRASSE_EGEDAL.metaDescription,
    images: [{ url: TERRASSE_EGEDAL.hero }],
  },
};

export default function TerrasseEgedalPage() {
  return <Longform content={TERRASSE_EGEDAL} />;
}
