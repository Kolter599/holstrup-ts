import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./_components/Reveal";
import { ContactCta } from "./_components/ContactCta";
import { Faq } from "./_components/Faq";
import { AllServicesJsonLd } from "./_components/JsonLd";
import { CityMarquee } from "./_components/CityMarquee";
import { RotatingWord } from "./_components/RotatingWord";
import { SectionHeader } from "./_components/SectionHeader";
import { BeforeAfter } from "./_components/BeforeAfter";
import { PartnerMarquee } from "./_components/PartnerMarquee";
import { PartnerRow } from "./_components/PartnerRow";
import { SITE, SERVICES, AREAS } from "@/lib/site";

const HERO_SERVICES = ["tagrenovering", "tilbygning", "totalentreprise", "traeterrasse"];
const PROCESS = [
  { title: "Ring eller skriv", body: "Du fortæller om opgaven. Vi vurderer om vi er det rigtige match — og er ærlige hvis vi ikke er." },
  { title: "Besigtigelse", body: "Vi kommer ud, ser opgaven og taler løsninger igennem. Helt uforpligtende." },
  { title: "Skriftligt tilbud", body: "Fast pris, klar materialeliste, tidsplan og vilkår. Ingen overraskelser undervejs." },
  { title: "Vi går i gang", body: "Holstrup TS udfører — eller styrer hele entreprisen. Vi afleverer formelt med mangelgennemgang." },
];

const TRUST_BULLETS: { heading: string; body: string }[] = [
  { heading: "30+ års erfaring", body: "Bygget både som hustømrer på de store byggepladser og som totalentreprenør på private villaer. Vi har set hvad der virker og hvad der ikke holder." },
  { heading: "Ét fast kontaktpunkt", body: "Vi styrer murer, VVS, el og maler så du kun har ét sted at ringe. Det betyder kortere svartid, færre misforståelser og en jævnere proces." },
  { heading: "Fast pris. Skriftlig aftale.", body: "Vi besigtiger grundigt, giver tilbud med fast pris, og dokumenterer alle ændringer skriftligt undervejs. Du ved altid præcis hvad næste regning kommer til at lyde på." },
];

const HOME_FAQ = [
  { q: "Hvor hurtigt kan I starte?", a: "På mindre opgaver typisk 1-3 uger. På tagudskiftning, tilbygning og hele entrepriser planlægger vi 4-12 uger frem alt efter sæson. Ring til en konkret vurdering — vi er ærlige om vores kalender." },
  { q: "Hvilket område dækker I?", a: "Vi har base i Frederikssund og dækker hele Nordsjælland — fra Hillerød, Allerød og Birkerød til kystbyerne Hornbæk, Rungsted og Tisvildeleje. Større entreprise- og rådgivningsopgaver tager vi også i Roskilde, Storkøbenhavn og det øvrige Sjælland. Vi har gennem mange år arbejdet på byggepladser i hovedstaden for flere af landets store entreprenører." },
  { q: "Kan I styre hele projektet som totalentreprenør?", a: "Ja. Vi koordinerer murer, VVS, el og maler, kører byggepladsen, og står for al dialog med bygherre, kommune og rådgivere. Du har én kontaktperson hele vejen." },
  { q: "Laver I rådgivning og tilsyn?", a: "Ja. Det er en stigende del af vores hverdag. Vi gennemgår tilbud, kører tilsyn under byggeri, og laver formelle 1- og 5-års eftersyn. Praktisk byggeerfaring gør os særligt gode til at se det der ikke fremgår af tegningerne." },
  { q: "Hvordan aflønner I arbejdet?", a: "Typisk fast pris efter besigtigelse. Mindre opgaver kan aftales på timepris med loft. Alt skrives ned — også eventuelle tillæg undervejs." },
];

export default function Home() {
  return (
    <>
      <AllServicesJsonLd />

      {/* HERO */}
      <section className="border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-8">
              <Reveal>
                <div className="eyebrow-accent mb-6">EST. 1992 · CVR 16056839</div>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="display-xl">
                  <span className="block whitespace-nowrap">Vi udfører</span>
                  <span className="block whitespace-nowrap"><RotatingWord /></span>
                  <span className="block whitespace-nowrap">i Nordsjælland.</span>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">
                  Holstrup TS er et lokalt tømrerfirma i Frederikssund med 30+ års erfaring. Fra enkelte tømreropgaver til fulde hovedentrepriser — udført ordentligt, til tiden, og med ét fast kontaktpunkt.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/kontakt" className="btn-accent">Indhent tilbud</Link>
                  <a href={`tel:${SITE.phone}`} className="btn-outline">Ring {SITE.phoneDisplay}</a>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-4">
              <Reveal delay={300}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
                  <Image
                    src="/images/finn-velux.jpg"
                    alt="Holstrup TS — Velux-montage"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 font-mono text-[11px] text-[color:var(--color-muted)] uppercase tracking-wider">
                  ↳ Velux-montage · Nordsjælland
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <PartnerMarquee />

      {/* TRE STATISKE TRUST BULLETS */}
      <section className="border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-px bg-[color:var(--color-line)]">
          {TRUST_BULLETS.map((t, i) => (
            <div key={i} className="bg-white px-6 md:px-10 py-10 md:py-12 flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-extrabold text-2xl text-[color:var(--color-blue)]">0{i + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)]" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl leading-tight">{t.heading}</h3>
              <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* YDELSER (4 hero tiles) */}
      <section className="py-24 md:py-36">
        <SectionHeader
          number="01"
          eyebrow="YDELSER"
          title={<>Tømrer, entreprenør, <span style={{ color: "var(--color-blue)" }}>rådgiver</span>.</>}
          intro="Holstrup TS dækker hele faget. Klassiske tømreropgaver, hele entrepriser — og uvildig byggerådgivning fra en fagmand med fingre i træet."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {HERO_SERVICES.map((slug, i) => {
              const s = SERVICES.find((x) => x.slug === slug)!;
              const img = `/images/service-${slug === "tagrenovering" ? "tag" : slug === "totalentreprise" ? "totalentreprise" : slug === "traeterrasse" ? "terrasse" : slug}.jpg`;
              return (
                <Link
                  key={slug}
                  href={`/ydelser/${slug}`}
                  className="group bg-white p-0 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={img}
                      alt={s.title}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow-accent">0{i + 1}</span>
                      <span className="font-mono text-xs text-[color:var(--color-muted)]">{s.shortTitle}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight">{s.title}</h3>
                    <p className="text-[color:var(--color-ink-soft)] leading-relaxed text-[15px]">{s.excerpt}</p>
                    <span className="link-arrow mt-2">Læs mere</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 flex justify-end">
            <Link href="/ydelser" className="link-arrow">Se alle 12 ydelser</Link>
          </div>
        </div>
      </section>

      {/* PROCES */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="02"
          eyebrow="PROCES"
          title={<>Fire trin fra <span style={{ color: "var(--color-blue)" }}>tilbud</span> til aflevering.</>}
          intro="Vi arbejder skriftligt og forudsigeligt. Du ved hvad der sker, hvornår det sker, og hvad det koster — fra første samtale til afleveringsforretningen."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-4 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
            {PROCESS.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white p-8 h-full flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-extrabold text-5xl text-[color:var(--color-blue)]">0{i + 1}</span>
                    <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />
                  </div>
                  <h3 className="font-display font-bold text-xl">{p.title}</h3>
                  <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJEKTER (bento) */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)]">
        <SectionHeader
          number="03"
          eyebrow="PROJEKTER"
          title={<>Udvalgte opgaver fra <span style={{ color: "var(--color-blue)" }}>Nordsjælland</span>.</>}
          intro="Et lille udpluk af det vi har bygget, renoveret og rådgivet om de seneste år. Flere kommer til efterhånden som vi dokumenterer."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-4 md:gap-6">
            <ProjectCard className="md:col-span-7" image="/images/service-tag.jpg" title="Nyt tegltag + 2 Velux" location="Hillerød" type="Tagrenovering" />
            <ProjectCard className="md:col-span-5" image="/images/service-terrasse.jpg" title="Oak-terrasse 42 m²" location="Frederikssund" type="Terrasse" />
            <ProjectCard className="md:col-span-4" image="/images/service-gipsvaeg.jpg" title="Lejlighedsrenovering" location="Frederiksberg" type="Renovering" />
            <ProjectCard className="md:col-span-4" image="/images/service-sommerhus.jpg" title="Sommerhus ved kysten" location="Hornbæk" type="Sommerhus" />
            <ProjectCard className="md:col-span-4" image="/images/service-vinduer.jpg" title="Nye facadevinduer" location="Allerød" type="Vinduer" />
          </div>
          <div className="mt-10 flex justify-end">
            <Link href="/projekter" className="link-arrow">Se alle projekter</Link>
          </div>
        </div>
      </section>

      {/* LOGO-RÆKKE — second mention af "har bygget for" */}
      <section className="border-t border-[color:var(--color-line)] hidden md:block">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 md:py-10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] mb-5">↳ Har bygget for</div>
          <PartnerRow />
        </div>
      </section>
      <div className="md:hidden">
        <PartnerMarquee compact />
      </div>

      {/* FØR / EFTER (one signature interactive moment) */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <SectionHeader
          number="04"
          eyebrow="FØR / EFTER"
          title={<>Træk i barren — se forskellen <span style={{ color: "var(--color-blue)" }}>selv</span>.</>}
          intro="Tagrenovering på en klassisk villa i Nordsjælland. Samme hus, samme vinkel — og to nye Velux-ovenlysvinduer indfældet flush i tagfladen."
        />
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <BeforeAfter
            beforeSrc="/images/before-tag.jpg"
            afterSrc="/images/after-tag.jpg"
            beforeAlt="Tag før renovering"
            afterAlt="Tag efter renovering"
          />
        </div>
      </section>

      {/* DÆKNING */}
      <section className="py-24 md:py-36 border-t border-[color:var(--color-line)]">
        <SectionHeader
          number="05"
          eyebrow="DÆKNINGSOMRÅDE"
          title={<>Hele <span style={{ color: "var(--color-blue)" }}>Nordsjælland</span> er hjemmebane.</>}
          intro="Fast base i Frederikssund. Vi løser opgaver i Hillerød, Allerød, Farum og hele Frederikssund-bæltet — plus kystbyerne fra Humlebæk til Tisvildeleje."
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] mb-4">Kerneområder</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5 mb-12">
                {AREAS.filter((a) => a.tier === "core").map((a) => (
                  <Link key={a.slug} href={`/tomrer-${a.slug}`} className="font-display font-medium text-base hover:text-[color:var(--color-blue)] transition-colors">
                    {a.name} <span className="font-mono text-xs text-[color:var(--color-muted)]">{a.postal}</span>
                  </Link>
                ))}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] mb-4">Kystbyer · Sommerhus & villa</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5">
                {AREAS.filter((a) => a.tier === "coast").map((a) => (
                  <Link key={a.slug} href={`/tomrer-${a.slug}`} className="font-display font-medium text-base hover:text-[color:var(--color-blue)] transition-colors">
                    {a.name} <span className="font-mono text-xs text-[color:var(--color-muted)]">{a.postal}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="bg-[color:var(--color-surface)] p-8 border border-[color:var(--color-line)]">
                <div className="eyebrow-accent mb-3">Adresse</div>
                <div className="font-display text-2xl font-bold leading-tight">{SITE.address.street}<br />{SITE.address.postal} {SITE.address.city}</div>
                <div className="hairline my-6" />
                <div className="eyebrow-accent mb-3">Kontakt</div>
                <a href={`tel:${SITE.phone}`} className="block font-display text-3xl font-bold hover:text-[color:var(--color-blue)] transition-colors">{SITE.phoneDisplay}</a>
                <a href={`mailto:${SITE.email}`} className="block mt-2 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-blue)] break-all">{SITE.email}</a>
                <div className="hairline my-6" />
                <div className="eyebrow-accent mb-3">Responstid</div>
                <p className="text-[color:var(--color-ink-soft)]">Vi vender personligt tilbage indenfor 24 timer — typisk samme dag.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CityMarquee variant="light" />

      <Faq number="06" items={HOME_FAQ} />

      <ContactCta />
    </>
  );
}

function ProjectCard({ image, title, location, type, className = "" }: { image: string; title: string; location: string; type: string; className?: string }) {
  return (
    <Reveal className={className}>
      <div className="group flex flex-col gap-4">
        <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-surface)]">
          <Image src={image} alt={title} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 text-[color:var(--color-ink)] text-[11px] font-mono uppercase tracking-wider">{type}</div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">↳ {location}</div>
          <div className="font-display font-bold text-xl mt-1">{title}</div>
        </div>
      </div>
    </Reveal>
  );
}
