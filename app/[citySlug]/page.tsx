import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { Faq } from "../_components/Faq";
import { ServiceJsonLd } from "../_components/JsonLd";
import { SectionHeader } from "../_components/SectionHeader";
import { CityMarquee } from "../_components/CityMarquee";
import { Reveal } from "../_components/Reveal";
import { AREAS, SERVICES, SITE } from "@/lib/site";
import { buildCityContent } from "@/lib/city-content";
import { SERVICE_CONTENT } from "@/lib/service-content";

export const dynamicParams = false;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  return AREAS.map((a) => ({ citySlug: `tomrer-${a.slug}` }));
}

function areaFromSlug(citySlug: string) {
  const raw = citySlug.replace(/^tomrer-/, "");
  return AREAS.find((a) => a.slug === raw);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const area = areaFromSlug(citySlug);
  if (!area) return {};
  const title = `Tømrer ${area.name} | Holstrup TS — 30+ års erfaring`;
  const description = `Holstrup TS løser tømrer- og entrepriseopgaver i ${area.name}. Tag, tilbygning, renovering og byggerådgivning. Ring til Finn på ${SITE.phoneDisplay}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${citySlug}` },
    openGraph: {
      url: `${SITE.url}/${citySlug}`,
      title,
      description,
      images: [{ url: "/images/service-tag.jpg" }],
    },
  };
}

export default async function CityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const area = areaFromSlug(citySlug);
  if (!area) notFound();
  const content = buildCityContent(area);
  const popular = SERVICES.filter((s) => content.popularServices.includes(s.slug));
  const neighbors = AREAS.filter((a) => a.slug !== area.slug && a.tier === area.tier).slice(0, 6);

  return (
    <>
      <ServiceJsonLd
        services={popular.map((s) => ({
          slug: s.slug,
          title: `${s.title} i ${area.name}`,
          description: s.excerpt,
        }))}
      />

      <Breadcrumbs
        items={[
          { name: "Forside", href: "/" },
          { name: "Områder", href: "/omraader" },
          { name: area.name },
        ]}
      />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">
              {area.tier === "coast" ? "KYSTBYER · SOMMERHUS & VILLA" : "FREDERIKSSUND-BÆLTET · NORDSJÆLLAND"}
              <span className="text-[color:var(--color-muted)] mx-2">·</span>
              {area.postal}
            </div>
            <h1 className="display-xl">
              Tømrer i <span style={{ color: "var(--color-blue)" }}>{area.name}</span>.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">
              {content.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/kontakt" className="btn-accent">Indhent tilbud i {area.name}</Link>
              <a href={`tel:${SITE.phone}`} className="btn-outline">Ring {SITE.phoneDisplay}</a>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="bg-[color:var(--color-surface)] p-7 border border-[color:var(--color-line)]">
              <div className="eyebrow-accent mb-3">Fra Holstrup TS til {area.name}</div>
              <div className="font-display text-2xl font-bold leading-tight">{content.travelTime}</div>
              <div className="hairline my-5" />
              <div className="eyebrow-accent mb-2">Postnummer</div>
              <div className="font-mono text-lg">{area.postal} {area.name}</div>
              <div className="hairline my-5" />
              <a href={`tel:${SITE.phone}`} className="block font-display text-2xl font-bold hover:text-[color:var(--color-blue)] transition-colors">{SITE.phoneDisplay}</a>
            </div>
          </div>
        </div>
      </section>

      {/* PITCH */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-5">
            <div className="eyebrow-accent mb-4">Lokal tømrer</div>
            <h2 className="display-lg">{content.pitch.split(".")[0]}.</h2>
          </div>
          <div className="md:col-span-7 prose-body">
            {content.sections.map((s, i) => (
              <section key={i}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* MEST EFTERSPURGTE YDELSER I BYEN */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="01"
          eyebrow={`YDELSER I ${area.name.toUpperCase()}`}
          title={<>Mest efterspurgte i <span style={{ color: "var(--color-blue)" }}>{area.name}</span>.</>}
          intro="Det vi typisk bliver kaldt ud til lokalt — vurderet ud fra det vi laver i området."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {popular.map((s, i) => {
              const c = SERVICE_CONTENT[s.slug];
              return (
                <Link key={s.slug} href={`/ydelser/${s.slug}`} className="group h-full bg-white flex flex-col">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={c?.hero ?? "/images/service-tag.jpg"} alt={s.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 text-[color:var(--color-ink)] text-[11px] font-mono uppercase tracking-wider">0{i + 1}</div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                    <span className="eyebrow-accent">{s.shortTitle}</span>
                    <h3 className="font-display font-bold text-xl leading-tight">{s.title} i {area.name}</h3>
                    <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">{s.excerpt}</p>
                    <span className="link-arrow mt-auto pt-2">Læs mere</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NABO-OMRÅDER */}
      <section className="py-20 md:py-28 border-t border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="eyebrow-accent mb-6">Vi arbejder også i</div>
          <div className="flex flex-wrap gap-3">
            {neighbors.map((n) => (
              <Link key={n.slug} href={`/tomrer-${n.slug}`} className="inline-flex items-center gap-2 px-4 py-2 border border-[color:var(--color-line-strong)] rounded-full text-sm font-medium hover:bg-[color:var(--color-ink)] hover:text-white hover:border-[color:var(--color-ink)] transition-colors">
                Tømrer {n.name} <span className="font-mono text-xs opacity-60">{n.postal}</span>
              </Link>
            ))}
            <Link href="/omraader" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[color:var(--color-accent)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-deep)] transition-colors">
              Se alle områder →
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <CityMarquee variant="light" />
      </Reveal>

      <Faq
        number="—"
        title={`FAQ — tømrer i ${area.name}`}
        items={[
          { q: `Hvor hurtigt kan I komme i ${area.name}?`, a: `Holstrup TS dækker ${area.name} fra Frederikssund — ${content.travelTime}. Mindre opgaver kan typisk planlægges indenfor 1-3 uger.` },
          { q: `Giver I fast pris på opgaven?`, a: `Ja. Efter en fysisk besigtigelse giver vi altid skriftligt tilbud med fast pris. Eventuelle tillæg aftales skriftligt via aftaleseddel.` },
          { q: `Kan I styre hele projektet som totalentreprenør?`, a: `Ja. Vi koordinerer murer, VVS, el og maler og står for dialogen med bygherre, kommune og rådgivere.` },
          { q: `Hvilke materialer anbefaler I i ${area.name}?`, a: area.tier === "coast" ? `Til kystbyer som ${area.name} anbefaler vi materialer der tåler salt, vind og fugt — fx hårdtræ til terrasser, syrefaste beslag, og kompositmaterialer hvor det giver mening.` : `Vi vælger altid materialer ud fra husets stil, lokalplanen og hvor meget vedligehold du vil lave. Ingen "one size fits all".` },
        ]}
      />

      <ContactCta
        heading={<>Opgave i <span style={{ color: "var(--color-accent)" }}>{area.name}</span>?</>}
        body="Ring til Finn personligt — du får én fagmand i røret, ikke et call-center. Den første besigtigelse er gratis og uforpligtende."
      />
    </>
  );
}
