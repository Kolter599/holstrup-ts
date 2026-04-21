import { SITE } from "@/lib/site";

const ITEMS = [
  { stat: "30+ år", label: "i byggebranchen" },
  { stat: "Én kontakt", label: "fra tilbud til aflevering" },
  { stat: "Nordsjælland", label: "fast base i Frederikssund" },
  { stat: "Hele faget", label: "tømrer, snedker, entreprise" },
];

export function TrustBar() {
  void SITE;
  return (
    <section className="border-y border-[color:var(--color-line)]">
      <div className="mx-auto max-w-6xl px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--color-line)]">
        {ITEMS.map((it, i) => (
          <div key={i} className="py-8 px-4 md:px-6 first:pl-0 text-center md:text-left">
            <div className="font-display text-2xl md:text-3xl text-[color:var(--color-blue)]">{it.stat}</div>
            <div className="text-sm text-[color:var(--color-muted)] mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
