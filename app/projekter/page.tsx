import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { SectionHeader } from "../_components/SectionHeader";
import { Reveal } from "../_components/Reveal";
import { CityMarquee } from "../_components/CityMarquee";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projekter — udvalgte opgaver i Nordsjælland",
  description:
    "Udvalgte projekter fra Holstrup TS — tagrenovering, tilbygning, sommerhus og totalentreprise i Nordsjælland og Storkøbenhavn.",
  alternates: { canonical: "/projekter" },
  openGraph: {
    url: `${SITE.url}/projekter`,
    title: "Projekter — Holstrup TS",
    description: "Udvalgte tømrer- og entrepriseopgaver i Nordsjælland.",
    images: [{ url: "/images/service-tag.jpg" }],
  },
};

type Project = {
  title: string;
  location: string;
  type: string;
  description: string;
  image: string;
};

const PROJECTS: Project[] = [
  {
    title: "Velux-vinduer i villa",
    location: "Frederikssund",
    type: "Tag & ovenlys",
    description: "Montage af stort Velux-vinduesparti i tagetagen. Korrekt inddækning, tæt undertag og indvendig afslutning der passer husets stil.",
    image: "/images/finn-velux.jpg",
  },
  {
    title: "Totalrenovering af 60'er villa",
    location: "Nordsjælland",
    type: "Totalrenovering",
    description: "Gennemgribende renovering med nye vægge, gulve og badeværelse. Holstrup TS som totalentreprenør med styring af alle fag.",
    image: "/images/finn-renovering.jpg",
  },
  {
    title: "Nyt tegltag i Hillerød",
    location: "Hillerød",
    type: "Tagrenovering",
    description: "Udskiftning af gammelt tegltag inkl. nyt undertag, ny ventilation og to Velux-ovenlys. Tæt og fremtidssikret.",
    image: "/images/service-tag.jpg",
  },
  {
    title: "Træterrasse i hårdtræ",
    location: "Frederikssund",
    type: "Terrasse",
    description: "Ny terrasse i ipe — over 40 m² med integreret trappe og overdækning. Korrekt fundament med luft under brædderne.",
    image: "/images/service-terrasse.jpg",
  },
  {
    title: "Sommerhus-renovering ved kysten",
    location: "Hornbæk",
    type: "Sommerhus",
    description: "Efterisolering og ny facadebeklædning i cedertræ. Nye vinduer og terrasse — sommerhuset er nu brugbart hele året.",
    image: "/images/service-sommerhus.jpg",
  },
  {
    title: "Lejlighedsrenovering",
    location: "København",
    type: "Renovering",
    description: "Nye gipsvægge, gulve og dørpartier i en ældre lejlighed. Komplet entreprise med koordinering af el og VVS.",
    image: "/images/service-gipsvaeg.jpg",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Projekter" }]} />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">{PROJECTS.length} UDVALGTE OPGAVER</div>
            <h1 className="display-xl">
              Udvalgte <span style={{ color: "var(--color-blue)" }}>opgaver</span>.
            </h1>
          </div>
          <p className="md:col-span-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            Et udpluk af det vi har bygget, renoveret og rådgivet om for private bygherrer og erhvervskunder. Vi tilføjer løbende nye projekter når de er afleveret.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-20 md:py-32">
        <SectionHeader
          number="01"
          eyebrow="GALLERI"
          title={<>Senest <span style={{ color: "var(--color-blue)" }}>afsluttede</span> projekter.</>}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
          {PROJECTS.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <article className="bg-white h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-surface)]">
                  <Image src={p.image} alt={p.title} fill sizes="(min-width:768px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 text-[color:var(--color-ink)] text-[11px] font-mono uppercase tracking-wider">{p.type}</div>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">↳ {p.location}</div>
                  <h2 className="font-display font-bold text-xl md:text-2xl leading-tight">{p.title}</h2>
                  <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-relaxed">{p.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-10 mt-10 text-[color:var(--color-muted)] text-sm">
          Flere projekter følger — vi dokumenterer løbende.
        </div>
      </section>

      <CityMarquee variant="light" />

      <ContactCta />
    </>
  );
}
