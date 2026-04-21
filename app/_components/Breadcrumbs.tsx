import Link from "next/link";
import { BreadcrumbJsonLd } from "./JsonLd";

type Item = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <>
      <BreadcrumbJsonLd items={items.map((i) => ({ name: i.name, url: i.href }))} />
      <nav aria-label="Brødkrumme" className="mx-auto max-w-7xl px-6 md:px-10 pt-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              {it.href && i < items.length - 1 ? (
                <Link href={it.href} className="hover:text-[color:var(--color-blue)]">{it.name}</Link>
              ) : (
                <span className="text-[color:var(--color-ink)]">{it.name}</span>
              )}
              {i < items.length - 1 && <span aria-hidden className="text-[color:var(--color-blue)]">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
