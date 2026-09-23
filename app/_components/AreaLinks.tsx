import Link from "next/link";
import { AREAS } from "@/lib/site";

export function AreaLinks({ exclude }: { exclude?: string }) {
  const core = AREAS.filter((a) => a.tier === "core" && a.slug !== exclude);
  const coast = AREAS.filter((a) => a.tier === "coast" && a.slug !== exclude);
  return (
    <section className="border-t border-[color:var(--color-line)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="eyebrow mb-6">Områder</div>
        <h2 className="display-lg mb-10 max-w-2xl">
          Tømrer i hele <em className="italic">Nordsjælland.</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="text-sm font-medium text-[color:var(--color-muted)] mb-4 uppercase tracking-wider">Kerneområder</div>
            <ul className="space-y-2">
              {core.map((a) => (
                <li key={a.slug}>
                  <Link href={`/tomrer-${a.slug}`} className="text-lg hover:text-[color:var(--color-blue)]">
                    Tømrer {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-[color:var(--color-muted)] mb-4 uppercase tracking-wider">Kystbyer & sommerhus</div>
            <ul className="space-y-2">
              {coast.map((a) => (
                <li key={a.slug}>
                  <Link href={`/tomrer-${a.slug}`} className="text-lg hover:text-[color:var(--color-blue)]">
                    Tømrer {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
