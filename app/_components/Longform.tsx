import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { ContactCta } from "./ContactCta";
import { LeadFormAside, LeadFormSection } from "./LeadFormSection";
import { Faq } from "./Faq";
import { ServiceJsonLd } from "./JsonLd";
import { CityMarquee } from "./CityMarquee";
import { Reviews } from "./Reviews";
import { SITE } from "@/lib/site";
import type { Block, LongformContent } from "@/lib/longform";

/**
 * Én renderer til de fire langform-sider. Samme skelet som ydelsessiden —
 * hero, brødtekst med formular i sidespalten, FAQ, formular igen, CTA —
 * men brødteksten kan også indeholde en pristabel eller en liste, fordi
 * det er de to ting de her sider vinder på.
 */

function PriceTable({ block }: { block: Extract<Block, { kind: "prices" }> }) {
  return (
    <section>
      <h2>{block.heading}</h2>
      {block.intro && <p>{block.intro}</p>}
      {/* Tabellen er den eneste ting på siden der må scrolle vandret. */}
      <div className="my-8 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <tbody>
            {block.rows.map((row) => (
              <tr
                key={row.label}
                className="border-t border-[color:var(--color-line)] align-top last:border-b"
              >
                <th scope="row" className="py-5 pr-6 font-display text-lg font-bold leading-snug">
                  {row.label}
                  {row.detail && (
                    <span className="mt-1.5 block text-sm font-normal font-sans leading-relaxed text-[color:var(--color-ink-soft)]">
                      {row.detail}
                    </span>
                  )}
                </th>
                <td className="py-5 whitespace-nowrap text-right font-mono text-base font-semibold text-[color:var(--color-blue)] md:text-lg">
                  {row.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && (
        <p className="text-sm text-[color:var(--color-muted)]">{block.note}</p>
      )}
    </section>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "prices") return <PriceTable key={i} block={block} />;
        if (block.kind === "sources") {
          return (
            <section key={i}>
              <h2>{block.heading}</h2>
              {block.intro && <p>{block.intro}</p>}
              <ul className="mt-4">
                {block.items.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener">{s.label}</a> — {s.note}
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        if (block.kind === "list") {
          return (
            <section key={i}>
              <h2>{block.heading}</h2>
              {block.intro && <p>{block.intro}</p>}
              <ul className="mt-4">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              {block.outro && <p className="mt-5">{block.outro}</p>}
            </section>
          );
        }
        return (
          <section key={i}>
            <h2>{block.heading}</h2>
            {block.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        );
      })}
    </>
  );
}

export function Longform({ content }: { content: LongformContent }) {
  return (
    <>
      <ServiceJsonLd
        services={[
          {
            slug: content.path.replace(/^\//, ""),
            title: content.service.name,
            description: content.service.description,
            url: `${SITE.url}${content.path}`,
          },
        ]}
      />

      <Breadcrumbs items={content.breadcrumb} />

      {/* HERO */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-16 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <div className="eyebrow-accent mb-6">{content.eyebrow.toUpperCase()}</div>
            <h1 className="display-xl">{content.h1}</h1>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">
              {content.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={content.serviceSlug ? `/kontakt?ydelse=${content.serviceSlug}` : "/kontakt"}
                className="btn-accent"
              >
                Indhent tilbud
              </Link>
              <a href={`tel:${SITE.phone}`} className="btn-outline">
                Ring {SITE.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
              <Image
                src={content.hero}
                alt={content.heroAlt}
                fill
                priority
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INDHOLD */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-16 grid md:grid-cols-12 gap-12 md:gap-12 lg:gap-16">
          <aside className="md:col-span-5 md:order-2 md:sticky md:top-32 self-start">
            <LeadFormAside path={content.path} serviceSlug={content.serviceSlug} />
            <div className="hairline my-8" />
            <div className="eyebrow-accent mb-4">{content.aside.heading}</div>
            <ul className="space-y-3">
              {content.aside.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[color:var(--color-ink-soft)] leading-relaxed">
                  <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="hairline my-8" />
            <div className="eyebrow-accent mb-4">Læs også</div>
            <ul className="space-y-4">
              {content.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="group block">
                    <span className="font-display font-bold leading-snug group-hover:text-[color:var(--color-blue)] transition-colors">
                      {r.label}
                    </span>
                    <span className="mt-1 block text-sm text-[color:var(--color-ink-soft)] leading-relaxed">
                      {r.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="md:col-span-7 md:order-1 prose-body">
            <Blocks blocks={content.blocks} />
          </div>
        </div>
      </section>

      <CityMarquee variant="light" />

      <Faq number="—" items={content.faq} title={`FAQ — ${content.h1.split(/[—:]/)[0].trim().toLowerCase()}`} />

      <Reviews />
      <LeadFormSection path={content.path} serviceSlug={content.serviceSlug} />
      <ContactCta />
    </>
  );
}
