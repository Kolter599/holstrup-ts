import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { Reveal } from "../_components/Reveal";
import { SectionHeader } from "../_components/SectionHeader";
import { PartnerRow } from "../_components/PartnerRow";
import { PartnerMarquee } from "../_components/PartnerMarquee";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om Holstrup TS — tømrerfirma siden 1992",
  description:
    "Holstrup TS er et tømrer- og snedkerfirma i Frederikssund med 30+ års erfaring. Læs om firmaet, manden bag, og hvordan vi arbejder.",
  alternates: { canonical: "/om" },
  openGraph: {
    url: `${SITE.url}/om`,
    title: "Om Holstrup TS",
    description: "30+ år på byggepladser i Nordsjælland.",
    images: [{ url: "/images/finn-renovering.jpg" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Om Holstrup" }]} />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">EST. 1992 · CVR 16056839 · FREDERIKSSUND</div>
            <h1 className="display-xl">
              30+ år på byggepladser i <span style={{ color: "var(--color-blue)" }}>Nordsjælland</span>.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">
              Holstrup TS er et lokalt tømrerfirma drevet af Finn Holm Pedersen — fortsat på pladsen hver dag, og med 30+ års erfaring fra byggepladser i Nordsjælland og hovedstaden.
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <Stat label="År i faget" value="30+" />
            <Stat label="Grundlagt" value="1992" />
            <Stat label="Område" value="Nordsjl." />
            <Stat label="Holdning" value="Ét ord" />
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        <Image src="/images/finn-renovering.jpg" alt="Holstrup TS i et renoveringsprojekt" fill priority className="object-cover" sizes="100vw" />
      </section>

      {/* INDHOLD */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-20">
          <aside className="md:col-span-4 md:sticky md:top-32 self-start space-y-8">
            <div>
              <div className="eyebrow-accent mb-3">Manden bag</div>
              <div className="font-display text-2xl font-bold leading-tight">{SITE.owner}</div>
              <div className="text-[color:var(--color-ink-soft)] mt-1">Tømrermester · Indehaver · Frederikssund</div>
            </div>
            <div className="hairline" />
            <div>
              <div className="eyebrow-accent mb-3">Firmaet</div>
              <dl className="divide-y divide-[color:var(--color-line)] text-sm">
                <Row term="Indehaver" def={SITE.owner} />
                <Row term="CVR" def={SITE.cvr} />
                <Row term="Grundlagt" def={String(SITE.foundedYear)} />
                <Row term="Adresse" def={`${SITE.address.street}, ${SITE.address.postal} ${SITE.address.city}`} />
                <Row term="Telefon" def={SITE.phoneDisplay} />
                <Row term="E-mail" def={SITE.email} />
              </dl>
            </div>
          </aside>
          <div className="md:col-span-8 prose-body">
            <h2>Et tømrerfirma med rødder i Nordsjælland</h2>
            <p>
              Holstrup TS — Tømrer & Snedker Entreprise — er et lokalt forankret håndværkerfirma med base i Frederikssund. Vi løser tømrer- og snedkeropgaver for private bygherrer, ejendomsforeninger og større entreprenører i hele Nordsjælland — fra mindre snedkeropgaver og gipsvægge, til hele hovedentrepriser på villaer og sommerhuse.
            </p>

            <h2>Manden bag firmaet</h2>
            <p>
              Bag Holstrup TS står Finn Holm Pedersen. Han har arbejdet i byggebranchen siden ung og har stået på byggepladser i Nordsjælland, i København og på store entrepriser — fra klassiske villarenoveringer til nybyg og renovering af ejendomskomplekser. Det er 30+ års erfaring man ikke læser sig til.
            </p>

            <h2>Hustømrer for de store, egenmester for de private</h2>
            <p>
              Holstrup TS arbejder ofte to steder på én gang. Som hustømrer for større entreprenører bliver vi hentet ind på opgaver der kræver erfaring og overblik — dér hvor en projektleder har brug for en rutineret tømrer, der kan tage stilling uden at skulle spørge til hver detalje. Samtidig kører vi som selvstændig entreprenør for private bygherrer, sommerhusejere og mindre boligforeninger, hvor vi enten står for tømrerarbejdet eller som totalentreprenør for hele projektet.
            </p>

            <h2>Rådgivning bygget på praktisk erfaring</h2>
            <p>
              De senere år er rådgivningsopgaver fyldt mere. Når Holstrup gennemgår et hus, et tilbud eller et stykke færdigt arbejde, ser vi det som tømrere med fingre i træet. Vi har selv siddet med problemerne. Vi kender prisen på det der bliver gjort ordentligt — og regningen for det der ikke bliver.
            </p>

            <blockquote>
              Vi har set nok dårligt håndværk til at kunne spotte det. Og vi har lavet nok godt håndværk til at kunne vise, hvordan det bør gøres.
            </blockquote>

            <h2>Hvem ringer typisk til Holstrup TS?</h2>
            <ul>
              <li>Privatejere der skal renovere hus eller sommerhus, og som ønsker én fast kontaktperson gennem hele byggeriet.</li>
              <li>Større entreprenører der skal bruge en erfaren tømrer på et projekt med højt tempo.</li>
              <li>Boligforeninger og ejerforeninger der vil have uvildig gennemgang af tilbud eller færdigt arbejde.</li>
              <li>Arkitekter og bygherrer der mangler en praktisk anker i deres projektgruppe.</li>
            </ul>

            <h2>Sådan arbejder vi</h2>
            <ul>
              <li>Personligt engagement — indehaveren er selv med på pladsen.</li>
              <li>Faste priser og skriftlige aftaler — ingen overraskelser.</li>
              <li>Stærkt netværk til murer, VVS, el og maler — nødvendigt når entreprisen bliver bred.</li>
              <li>Lokal tilstedeværelse i Frederikssund og hele Nordsjælland.</li>
              <li>Fleksibilitet — fra én opgave til hele byggeprojekter.</li>
            </ul>

            <div className="mt-12 not-prose">
              <Link href="/ydelser" className="btn-outline">Se alle ydelser</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER LOGOS */}
      <section className="border-t border-[color:var(--color-line)] hidden md:block">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 md:py-14">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] mb-5">↳ Har bygget for</div>
          <PartnerRow />
        </div>
      </section>
      <div className="md:hidden">
        <PartnerMarquee compact />
      </div>

      {/* GALLERI */}
      <section className="py-20 md:py-28 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="—"
          eyebrow="GALLERI"
          title={<>Hverdag på <span style={{ color: "var(--color-blue)" }}>pladsen</span>.</>}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: "/images/finn-van.jpg", caption: "På vej ud" },
            { src: "/images/finn-roof.jpg", caption: "Velux-montage" },
            { src: "/images/service-raadgivning.jpg", caption: "Mål før snit" },
            { src: "/images/workshop.jpg", caption: "Værkstedet" },
          ].map((img, i) => (
            <Reveal key={i} delay={i * 80}>
              <div>
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image src={img.src} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                </div>
                <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">↳ {img.caption}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--color-surface)] p-5 border border-[color:var(--color-line)]">
      <div className="font-display font-extrabold text-3xl md:text-4xl text-[color:var(--color-blue)] leading-none">{value}</div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">{label}</div>
    </div>
  );
}

function Row({ term, def }: { term: string; def: string }) {
  return (
    <div className="py-2.5 flex justify-between gap-4">
      <dt className="text-[color:var(--color-muted)]">{term}</dt>
      <dd className="text-[color:var(--color-ink)] text-right">{def}</dd>
    </div>
  );
}
