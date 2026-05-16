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

      {/* FORM-FIRST — minimal hero + form is the dominant element on both mobile and desktop */}
      <section className="pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Form takes the lion's share on desktop, full width on mobile, always on top */}
          <div className="md:col-span-8 md:order-1">
            <div className="mb-5 md:mb-7">
              <div className="eyebrow-accent mb-3">Få et tilbud</div>
              <h1 className="display-lg leading-tight">
                Få et tilbud fra <span style={{ color: "var(--color-blue)" }}>Finn</span>.
              </h1>
              <p className="mt-3 text-[color:var(--color-ink-soft)] text-base md:text-lg">
                4 hurtige skridt — under et minut. Finn vender personligt tilbage, typisk samme dag.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Sidebar: phone first (also makes a big tap-to-call on mobile via order-2 below form) */}
          <aside className="md:col-span-4 md:order-2 grid gap-6 md:gap-8 content-start">
            <a
              href={`tel:${SITE.phone}`}
              className="block bg-[color:var(--color-ink)] text-white p-6 md:p-7 rounded-md hover:opacity-95 transition-opacity"
            >
              <div className="eyebrow-accent text-white/70 mb-2">Eller ring direkte</div>
              <div className="font-display text-2xl md:text-3xl font-extrabold leading-tight">
                {SITE.phoneDisplay}
              </div>
              <p className="mt-2 text-white/75 text-sm">
                Vi svarer 7–17 alle hverdage. Gratis og uforpligtende vurdering.
              </p>
            </a>

            <div>
              <div className="eyebrow-accent mb-2">Mail</div>
              <a
                href={`mailto:${SITE.email}`}
                className="font-display text-lg font-bold text-[color:var(--color-ink)] hover:text-[color:var(--color-blue)] break-all transition-colors"
              >
                {SITE.email}
              </a>
            </div>

            <div className="hairline" />

            <div>
              <div className="eyebrow-accent mb-2">Adresse</div>
              <div className="font-display text-base font-bold text-[color:var(--color-ink)] leading-tight">
                {SITE.address.street}
                <br />
                {SITE.address.postal} {SITE.address.city}
              </div>
            </div>

            <div className="text-[color:var(--color-ink-soft)] text-xs leading-relaxed">
              {SITE.fullName}
              <br />
              CVR {SITE.cvr} · Etableret {SITE.foundedYear}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
