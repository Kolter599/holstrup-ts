import type { Metadata } from "next";
import { Longform } from "../_components/Longform";
import { TERRASSE_FREDERIKSSUND } from "@/lib/longform-terrasse";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: TERRASSE_FREDERIKSSUND.metaTitle,
  description: TERRASSE_FREDERIKSSUND.metaDescription,
  alternates: { canonical: TERRASSE_FREDERIKSSUND.path },
  openGraph: {
    url: `${SITE.url}${TERRASSE_FREDERIKSSUND.path}`,
    title: TERRASSE_FREDERIKSSUND.metaTitle,
    description: TERRASSE_FREDERIKSSUND.metaDescription,
    images: [{ url: TERRASSE_FREDERIKSSUND.hero }],
  },
};

export default function TerrasseFrederikssundPage() {
  return <Longform content={TERRASSE_FREDERIKSSUND} />;
}
