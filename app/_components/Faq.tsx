import { FaqJsonLd } from "./JsonLd";
import { SectionHeader } from "./SectionHeader";

type Item = { q: string; a: string };

type Props = {
  items: Item[];
  title?: string;
  number?: string;
};

export function Faq({ items, title = "Ofte stillede spørgsmål", number = "07" }: Props) {
  return (
    <section className="py-24 md:py-36 border-t border-[color:var(--color-line)]">
      <FaqJsonLd items={items} />
      <SectionHeader number={number} eyebrow="FAQ" title={title} />
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="divide-y divide-[color:var(--color-line)] border-t border-[color:var(--color-line)]">
          {items.map((it, i) => (
            <details key={i} className="group py-7">
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                <span className="font-display font-bold text-xl md:text-2xl text-[color:var(--color-ink)] group-open:text-[color:var(--color-blue)]">
                  {it.q}
                </span>
                <span aria-hidden className="mt-2 text-[color:var(--color-muted)] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
              </summary>
              <p className="mt-4 text-[color:var(--color-ink-soft)] leading-relaxed pr-10">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
