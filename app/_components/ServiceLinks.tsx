import Link from "next/link";
import { SERVICES } from "@/lib/site";

export function ServiceLinks({ exclude }: { exclude?: string }) {
  const items = SERVICES.filter((s) => s.slug !== exclude);
  return (
    <section className="border-t border-[color:var(--color-line)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="eyebrow mb-6">Ydelser</div>
        <h2 className="display-lg mb-12 max-w-2xl">
          Et firma. <em className="italic">Et telefonnummer.</em> Fra mindre snedkeropgave til hele entreprisen.
        </h2>
        <div className="grid gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/ydelser/${s.slug}`}
              className="bg-[color:white] hover:bg-[color:var(--color-surface)] p-8 flex flex-col gap-3 transition-colors"
            >
              <span className="eyebrow text-[color:var(--color-blue)]">{s.shortTitle}</span>
              <span className="font-display text-2xl leading-tight">{s.title}</span>
              <span className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed mt-1">{s.excerpt}</span>
              <span className="text-sm text-[color:var(--color-blue)] mt-auto">Læs mere →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
