import type { Metadata } from "next";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactForm } from "./ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt Holstrup TS",
  description: `Kontakt Holstrup TS — ring til Finn på ${SITE.phoneDisplay}, skriv til ${SITE.email} eller send en besked via formularen. Typisk svar samme dag.`,
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Kontakt" }]} />

      {/* HERO */}
      <section className="pt-10 pb-12 md:pt-16 md:pb-20 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">SVAR SAMME DAG · GRATIS BESIGTIGELSE</div>
            <h1 className="display-xl">
              Ring til <span style={{ color: "var(--color-blue)" }}>Finn</span> personligt.
            </h1>
          </div>
          <p className="md:col-span-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            Den hurtigste vej til en vurdering er en telefonsamtale. Vi vender personligt tilbage indenfor et døgn — typisk samme dag. Den første besigtigelse er gratis og uforpligtende.
          </p>
        </div>
      </section>

      {/* RING + SKRIV */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-20">
          <aside className="md:col-span-5 space-y-8">
            <div>
              <div className="eyebrow-accent mb-3">Ring direkte</div>
              <a href={`tel:${SITE.phone}`} className="block font-display text-3xl md:text-4xl font-extrabold text-[color:var(--color-ink)] hover:text-[color:var(--color-blue)] transition-colors leading-tight">
                {SITE.phoneDisplay}
              </a>
              <p className="mt-2 text-[color:var(--color-ink-soft)] text-sm">Vi svarer 7-17 alle hverdage. Beskeder uden for åbningstid besvares næste morgen.</p>
            </div>
            <div className="hairline" />
            <div>
              <div className="eyebrow-accent mb-3">Skriv en mail</div>
              <a href={`mailto:${SITE.email}`} className="font-display text-xl md:text-2xl font-bold text-[color:var(--color-ink)] hover:text-[color:var(--color-blue)] break-all transition-colors">
                {SITE.email}
              </a>
            </div>
            <div className="hairline" />
            <div>
              <div className="eyebrow-accent mb-3">Adresse</div>
              <div className="font-display text-xl font-bold text-[color:var(--color-ink)] leading-tight">
                {SITE.address.street}<br />
                {SITE.address.postal} {SITE.address.city}
              </div>
            </div>
            <div className="hairline" />
            <div>
              <div className="eyebrow-accent mb-3">Firma</div>
              <div className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">
                {SITE.fullName}<br />
                CVR {SITE.cvr}<br />
                Etableret {SITE.foundedYear}
              </div>
            </div>
          </aside>
          <div className="md:col-span-7">
            <div className="bg-[color:var(--color-surface)] p-6 md:p-10 border border-[color:var(--color-line)]">
              <div className="eyebrow-accent mb-3">Send besked</div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">Beskriv din opgave</h2>
              <p className="text-[color:var(--color-ink-soft)] text-sm mb-8">Et par linjer er nok. Vi vender tilbage med spørgsmål eller en aftale om besigtigelse.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
