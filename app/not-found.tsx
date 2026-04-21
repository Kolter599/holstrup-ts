import Link from "next/link";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="py-24 md:py-40">
      <div className="mx-auto max-w-2xl px-6 md:px-10 text-center">
        <div className="eyebrow-accent mb-6">404 · SIDEN FINDES IKKE</div>
        <h1 className="display-lg mb-6">
          Den side findes <span style={{ color: "var(--color-blue)" }}>ikke længere</span>.
        </h1>
        <p className="text-[color:var(--color-ink-soft)] mb-10 leading-relaxed">
          Måske er adressen skrevet forkert, eller siden er flyttet. Kig på forsiden — eller ring direkte til Finn på {SITE.phoneDisplay}.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-accent">Til forsiden</Link>
          <a href={`tel:${SITE.phone}`} className="btn-outline">Ring {SITE.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
