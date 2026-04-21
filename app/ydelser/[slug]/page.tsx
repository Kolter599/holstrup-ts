import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { ContactCta } from "../../_components/ContactCta";
import { Faq } from "../../_components/Faq";
import { ServiceJsonLd } from "../../_components/JsonLd";
import { SectionHeader } from "../../_components/SectionHeader";
import { Reveal } from "../../_components/Reveal";
import { CityMarquee } from "../../_components/CityMarquee";
import { PartnerMarquee } from "../../_components/PartnerMarquee";
import { SERVICES, SITE } from "@/lib/site";
import { SERVICE_CONTENT } from "@/lib/service-content";

const B2B_SLUGS = new Set(["hovedentreprise", "totalentreprise", "byggeraadgivning"]);

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return {};
  return {
    title: svc.metaTitle,
    description: svc.metaDescription,
    alternates: { canonical: `/ydelser/${svc.slug}` },
    openGraph: {
      url: `${SITE.url}/ydelser/${svc.slug}`,
      title: svc.metaTitle,
      description: svc.metaDescription,
      images: [{ url: SERVICE_CONTENT[svc.slug]?.hero ?? "/images/service-tag.jpg" }],
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const svc = SERVICES.find((s) => s.slug === slug);
  const content = SERVICE_CONTENT[slug];
  if (!svc || !content) notFound();

  const related = SERVICES.filter((s) => s.slug !== svc.slug).slice(0, 3);
  const idx = SERVICES.findIndex((s) => s.slug === svc.slug);
  const num = String(idx + 1).padStart(2, "0");

  return (
    <>
      <ServiceJsonLd services={[{ slug: svc.slug, title: svc.title, description: svc.excerpt }]} />

      <Breadcrumbs
        items={[
          { name: "Forside", href: "/" },
          { name: "Ydelser", href: "/ydelser" },
          { name: svc.shortTitle },
        ]}
      />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <div className="eyebrow-accent mb-6">YDELSE / {num} · {content.eyebrow.toUpperCase()}</div>
            <h1 className="display-xl">{content.h1}</h1>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">{content.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/kontakt" className="btn-accent">Indhent tilbud</Link>
              <a href={`tel:${SITE.phone}`} className="btn-outline">Ring {SITE.phoneDisplay}</a>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
              <Image src={content.hero} alt={svc.title} fill priority sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* INDHOLD */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-20">
          <aside className="md:col-span-4 md:sticky md:top-32 self-start">
            <div className="eyebrow-accent mb-4">Det omfatter</div>
            <ul className="space-y-3">
              {content.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[color:var(--color-ink-soft)] leading-relaxed">
                  <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="hairline my-8" />
            <div className="eyebrow-accent mb-4">Holstrup TS</div>
            <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">
              30+ års erfaring fra rigtige byggepladser i Nordsjælland. Fast pris, skriftlig aftale, ét fast kontaktpunkt — fra første samtale til afleveringen.
            </p>
          </aside>
          <div className="md:col-span-8 prose-body">
            {content.sections.map((s, i) => (
              <section key={i}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* RELATERET */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="—"
          eyebrow="RELATEREDE YDELSER"
          title={<>Opgaver vi ofte <span style={{ color: "var(--color-blue)" }}>kombinerer</span>.</>}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {related.map((r) => {
              const c = SERVICE_CONTENT[r.slug];
              return (
                <Reveal key={r.slug}>
                  <Link href={`/ydelser/${r.slug}`} className="group h-full bg-white flex flex-col">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image src={c?.hero ?? "/images/service-tag.jpg"} alt={r.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                      <span className="eyebrow-accent">{r.shortTitle}</span>
                      <h3 className="font-display font-bold text-xl leading-tight">{r.title}</h3>
                      <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">{r.excerpt}</p>
                      <span className="link-arrow mt-auto pt-2">Læs mere</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {B2B_SLUGS.has(svc.slug) && <PartnerMarquee />}

      <CityMarquee variant="light" />

      <Faq number="—" items={content.faq} title={`FAQ — ${svc.title.toLowerCase()}`} />

      <ContactCta />
    </>
  );
}
