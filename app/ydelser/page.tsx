import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { AllServicesJsonLd } from "../_components/JsonLd";
import { SectionHeader } from "../_components/SectionHeader";
import { Reveal } from "../_components/Reveal";
import { CityMarquee } from "../_components/CityMarquee";
import { SERVICES, SITE } from "@/lib/site";
import { SERVICE_CONTENT } from "@/lib/service-content";

export const metadata: Metadata = {
  title: "Ydelser — tømrer, entreprise og byggerådgivning",
  description:
    "Se alle ydelser fra Holstrup TS — tag, terrasse, tilbygning, totalentreprise, renovering, sommerhus, vinduer og byggerådgivning. 30+ års erfaring i Nordsjælland.",
  alternates: { canonical: "/ydelser" },
  openGraph: {
    url: `${SITE.url}/ydelser`,
    title: "Ydelser — Holstrup TS",
    description: "Tømrer, entreprise og byggerådgivning i Nordsjælland.",
  },
};

export default function YdelserPage() {
  return (
    <>
      <AllServicesJsonLd />
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Ydelser" }]} />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">12 YDELSER · NORDSJÆLLAND</div>
            <h1 className="display-xl">
              Hele faget. <span style={{ color: "var(--color-blue)" }}>Ét firma.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            Fra gipsvæg til hovedentreprise — det hele med 30+ års erfaring bag hver beslutning. Holstrup TS dækker tømrer- og snedkerfaget bredt.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-24 md:py-36">
        <SectionHeader
          number="01"
          eyebrow="OVERBLIK"
          title={<>Vælg en ydelse — <span style={{ color: "var(--color-blue)" }}>se proces, pris og FAQ</span>.</>}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {SERVICES.map((s, i) => {
              const c = SERVICE_CONTENT[s.slug];
              return (
                <Reveal key={s.slug} delay={(i % 3) * 60}>
                  <Link href={`/ydelser/${s.slug}`} className="group h-full bg-white flex flex-col">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image src={c?.hero ?? "/images/service-tag.jpg"} alt={s.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 text-[color:var(--color-ink)] text-[11px] font-mono uppercase tracking-wider">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                      <span className="eyebrow-accent">{s.shortTitle}</span>
                      <h3 className="font-display font-bold text-xl md:text-2xl leading-tight">{s.title}</h3>
                      <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-relaxed">{s.excerpt}</p>
                      <span className="link-arrow mt-auto pt-2">Læs mere</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CityMarquee variant="light" />

      <ContactCta />
    </>
  );
}
