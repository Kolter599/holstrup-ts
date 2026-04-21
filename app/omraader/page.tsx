import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { CityMarquee } from "../_components/CityMarquee";
import { SectionHeader } from "../_components/SectionHeader";
import { AREAS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Områder — tømrer i hele Nordsjælland",
  description:
    "Holstrup TS løser tømrer- og entrepriseopgaver i Frederikssund, Hillerød, Allerød, Birkerød, Farum og langs Nordsjællands kyst. Se alle områder.",
  alternates: { canonical: "/omraader" },
  openGraph: {
    url: `${SITE.url}/omraader`,
    title: "Områder — Holstrup TS",
    description: "Tømrer i hele Nordsjælland — fra Frederikssund til Hornbæk.",
  },
};

export default function AreasPage() {
  const core = AREAS.filter((a) => a.tier === "core");
  const coast = AREAS.filter((a) => a.tier === "coast");

  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Områder" }]} />

      <section className="pt-10 pb-14 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="eyebrow-accent mb-6">{AREAS.length} BYER · NORDSJÆLLAND + STORKØBENHAVN</div>
          <h1 className="display-xl">
            <span className="block whitespace-nowrap">Hele <span style={{ color: "var(--color-blue)" }}>Nordsjælland</span></span>
            <span className="block whitespace-nowrap">er hjemmebane.</span>
          </h1>
          <p className="mt-10 md:mt-14 max-w-xl text-lg md:text-xl text-[color:var(--color-ink-soft)] leading-relaxed">
            Holstrup TS er baseret i Frederikssund og dækker hele Nordsjælland — fra Hillerød i øst til Ølstykke, Stenløse og Jyllinge lokalt, og langs hele Kattegat-kysten. Større entreprise- og rådgivningsopgaver tager vi også i Roskilde, Storkøbenhavn og det øvrige Sjælland.
          </p>
        </div>
      </section>

      <CityMarquee variant="light" />

      <section className="py-24 md:py-36">
        <SectionHeader
          number="01"
          eyebrow="KERNEOMRÅDER"
          title={<>Frederikssund-bæltet og <span style={{ color: "var(--color-blue)" }}>Nordsjællands midte</span>.</>}
          intro="De byer hvor vi har kortest kørsel og oftest bliver hentet ind til både løbende opgaver og hele entrepriser."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {core.map((a) => (
              <Link key={a.slug} href={`/tomrer-${a.slug}`} className="group h-full bg-white p-7 flex flex-col gap-3 hover:bg-[color:var(--color-surface)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-2xl group-hover:text-[color:var(--color-blue)] transition-colors">{a.name}</span>
                  <span className="font-mono text-xs text-[color:var(--color-muted)]">{a.postal}</span>
                </div>
                <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">{a.description}</p>
                <span className="link-arrow mt-auto pt-2">Tømrer {a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="02"
          eyebrow="KYSTBYER · SOMMERHUS & VILLA"
          title={<>Langs <span style={{ color: "var(--color-blue)" }}>Kattegat</span> og Øresund.</>}
          intro="Her bygger og renoverer vi sommerhuse og kystvillaer. Materialevalg og detaljer skal kunne tåle salt, sand og vind."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {coast.map((a) => (
              <Link key={a.slug} href={`/tomrer-${a.slug}`} className="group h-full bg-white p-7 flex flex-col gap-3 hover:bg-[color:var(--color-surface)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-2xl group-hover:text-[color:var(--color-blue)] transition-colors">{a.name}</span>
                  <span className="font-mono text-xs text-[color:var(--color-muted)]">{a.postal}</span>
                </div>
                <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">{a.description}</p>
                <span className="link-arrow mt-auto pt-2">Tømrer {a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        heading={<>Bor du <span style={{ color: "var(--color-accent)" }}>uden for listen</span>?</>}
        body="Ring alligevel — vi tager ofte opgaver i resten af Sjælland når omfanget passer. Den første snak er gratis."
      />
    </>
  );
}
