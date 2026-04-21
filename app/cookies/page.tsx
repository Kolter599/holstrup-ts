import type { Metadata } from "next";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Sådan bruger Holstrup TS cookies. Vi bruger cookies til at måle anonyme besøgsstatistikker — ikke til reklame-tracking.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Cookies" }]} />

      <section className="pt-10 pb-12 md:pt-16 md:pb-20 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="eyebrow-accent mb-6">PRIVATLIV · COOKIES</div>
          <h1 className="display-lg max-w-4xl">
            Cookies — <span style={{ color: "var(--color-blue)" }}>kort fortalt</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            Vi bruger cookies til at se hvor mange der besøger sitet, og hvilke sider der bliver læst — ikke til at følge dig rundt på nettet med reklamer. Det er det.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10 prose-body">
          <h2>Hvad vi bruger cookies til</h2>
          <p>
            Holstrup TS bruger Google Analytics 4 til at måle anonymiseret trafik på sitet. Det vil sige: hvor mange besøger forsiden, hvilke ydelsessider er populære, og hvor lang tid folk læser et blogindlæg. Det hjælper os med at vide hvilket indhold der virker.
          </p>

          <h2>Hvad vi <strong>ikke</strong> bruger cookies til</h2>
          <ul>
            <li>Vi sælger ikke dine data videre til tredjepart.</li>
            <li>Vi laver ikke profiler om dig på tværs af sites.</li>
            <li>Vi sender ikke dine oplysninger til sociale medier.</li>
          </ul>

          <h2>Hvilke cookies sættes konkret</h2>
          <ul>
            <li><strong>_ga</strong>, <strong>_ga_*</strong> — Google Analytics. Anonymiseret IP, holder typisk 13 måneder.</li>
            <li><strong>holstrup-cookies-accepted</strong> — vores egen, husker at du har sagt OK til banneret. Ingen personlige data.</li>
          </ul>

          <h2>Sådan siger du nej</h2>
          <p>
            Klik på <strong>Kun nødvendige</strong> i cookie-banneret når du første gang besøger sitet — så loader vi ikke Google Analytics overhovedet. Du kan også blokere cookies fra <code>holstrup-ts.dk</code> direkte i din browser, eller slette dem der allerede er sat under Indstillinger → Privatliv.
          </p>

          <h2>Hvis du har spørgsmål</h2>
          <p>
            Skriv eller ring til Holstrup TS — kontaktoplysninger findes i bunden af alle sider. Vi svarer personligt.
          </p>

          <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "2rem" }}>
            Senest opdateret: april 2026
          </p>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
