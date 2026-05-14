import { AREAS, SERVICES, SITE } from "@/lib/site";

type Json = Record<string, unknown>;

function emit(schema: Json) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return emit({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": `${SITE.url}/#business`,
    name: SITE.fullName,
    alternateName: SITE.name,
    description:
      "Tømrer- og snedkerfirma i Frederikssund med 30+ års erfaring. Renovering, tag, tilbygning, totalentreprise og byggerådgivning i hele Nordsjælland.",
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}/images/finn-velux.jpg`,
    logo: `${SITE.url}/images/holstrup-logo.jpg`,
    priceRange: "kr-kkr",
    currenciesAccepted: "DKK",
    paymentAccepted: "Bankoverførsel, MobilePay",
    taxID: SITE.cvr,
    vatID: `DK${SITE.cvr}`,
    foundingDate: `${SITE.foundedYear}-01-01`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postal,
      addressLocality: SITE.address.city,
      addressRegion: "Hovedstaden",
      addressCountry: "DK",
    },
    areaServed: [
      ...AREAS.map((a) => ({ "@type": "City", name: a.name })),
      { "@type": "AdministrativeArea", name: "Nordsjælland" },
      { "@type": "Country", name: "Danmark" },
    ],
    founder: { "@type": "Person", "@id": `${SITE.url}/#person` },
    knowsAbout: [
      "Tømrerarbejde",
      "Snedkerarbejde",
      "Tagrenovering",
      "Tilbygning",
      "Totalentreprise",
      "Hovedentreprise",
      "Byggerådgivning",
      "Sommerhusbyggeri",
      "Villa-renovering",
      "Gipsvægge",
      "Træterrasse",
    ],
    sameAs: [`https://www.google.com/search?q=Holstrup+TS+Frederikssund`],
  });
}

/**
 * WebSite + nav schema. Helps Google understand the top-level routes —
 * one of the inputs that determines whether sitelinks show under a SERP result.
 * Sitelinks themselves are picked automatically by Google, but a clean
 * WebSite + SiteNavigationElement signal speeds it up.
 */
export function WebsiteJsonLd() {
  return (
    <>
      {emit({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.fullName,
        alternateName: SITE.name,
        publisher: { "@id": `${SITE.url}/#business` },
        inLanguage: "da-DK",
      })}
      {emit({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "SiteNavigationElement", "@id": `${SITE.url}/#nav-ydelser`, name: "Ydelser", url: `${SITE.url}/ydelser` },
          { "@type": "SiteNavigationElement", "@id": `${SITE.url}/#nav-omraader`, name: "Områder", url: `${SITE.url}/omraader` },
          { "@type": "SiteNavigationElement", "@id": `${SITE.url}/#nav-projekter`, name: "Projekter", url: `${SITE.url}/projekter` },
          { "@type": "SiteNavigationElement", "@id": `${SITE.url}/#nav-om`, name: "Om Holstrup TS", url: `${SITE.url}/om` },
          { "@type": "SiteNavigationElement", "@id": `${SITE.url}/#nav-kontakt`, name: "Kontakt", url: `${SITE.url}/kontakt` },
        ],
      })}
    </>
  );
}

export function PersonJsonLd() {
  return emit({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.owner,
    jobTitle: "Tømrermester og byggerådgiver",
    description: `Indehaver af Holstrup TS. ${SITE.experienceYears} års erfaring fra byggebranchen — fra hustømrer på store entrepriser til selvstændige totalentrepriser på private villaer og sommerhuse.`,
    url: `${SITE.url}/om`,
    image: `${SITE.url}/images/finn-velux.jpg`,
    worksFor: { "@type": "Organization", "@id": `${SITE.url}/#business` },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressCountry: "DK",
    },
  });
}

type ServiceRef = { slug: string; title: string; description: string };

export function ServiceJsonLd({ services }: { services: ServiceRef[] }) {
  return emit({
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.description,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: AREAS.map((a) => ({ "@type": "City", name: a.name })),
      url: `${SITE.url}/ydelser/${s.slug}`,
      serviceType: s.title,
    })),
  });
}

export function AllServicesJsonLd() {
  return (
    <ServiceJsonLd
      services={SERVICES.map((s) => ({ slug: s.slug, title: s.title, description: s.excerpt }))}
    />
  );
}

type FaqItem = { q: string; a: string };

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return emit({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  });
}

type ArticleInput = {
  title: string;
  description: string;
  datePublished: string;
  image?: string;
  url: string;
};

export function ArticleJsonLd({ article }: { article: ArticleInput }) {
  return emit({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    image: article.image ? `${SITE.url}${article.image}` : undefined,
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#business` },
    mainEntityOfPage: { "@type": "WebPage", "@id": article.url },
  });
}

type Crumb = { name: string; url?: string };

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return emit({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url ? `${SITE.url}${c.url}` : undefined,
    })),
  });
}
