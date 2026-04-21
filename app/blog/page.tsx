import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { SectionHeader } from "../_components/SectionHeader";
import { Reveal } from "../_components/Reveal";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Viden — tømrer-guider og byggerådgivning",
  description:
    "Guides, prisestimater og byggerådgivning fra en tømrer med 30+ års erfaring. Priser på tag, renovering, sommerhus og totalentreprise.",
  alternates: { canonical: "/blog" },
  openGraph: {
    url: `${SITE.url}/blog`,
    title: "Viden — Holstrup TS",
    description: "Guides og byggerådgivning fra Nordsjælland.",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: "Viden" }]} />

      {/* HERO */}
      <section className="pt-10 pb-12 md:pt-16 md:pb-20 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-16 items-end">
          <div className="md:col-span-8">
            <div className="eyebrow-accent mb-6">VIDEN · GUIDES · PRISER</div>
            <h1 className="display-xl">
              Ærlig <span style={{ color: "var(--color-blue)" }}>byggerådgivning</span>.
            </h1>
          </div>
          <p className="md:col-span-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            Priser, faldgruber og praktisk byggerådgivning — fra en tømrer med 30+ års erfaring. Skrevet for boligejere der gerne vil træffe gode beslutninger.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section className="py-20 md:py-32">
        <SectionHeader
          number="01"
          eyebrow="ARTIKLER"
          title={<>Senest fra <span style={{ color: "var(--color-blue)" }}>værkstedet</span>.</>}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {posts.length === 0 ? (
            <p className="py-20 text-center text-[color:var(--color-muted)]">Indhold på vej.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 60}>
                  <Link href={`/blog/${p.slug}`} className="group h-full bg-white flex flex-col">
                    {p.image && (
                      <div className="relative aspect-[3/2] overflow-hidden bg-[color:var(--color-surface)]">
                        <Image src={p.image} alt={p.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="eyebrow-accent">{p.category ?? "Viden"}</span>
                        <span className="font-mono text-[11px] text-[color:var(--color-muted)]">{formatDate(p.date)}</span>
                      </div>
                      <h2 className="font-display font-bold text-xl md:text-2xl leading-tight group-hover:text-[color:var(--color-blue)]">
                        {p.title}
                      </h2>
                      <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-relaxed">{p.description}</p>
                      <span className="link-arrow mt-auto pt-2">Læs videre</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactCta />
    </>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" });
}
