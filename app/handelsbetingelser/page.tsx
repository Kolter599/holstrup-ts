import type { Metadata } from "next";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ContactCta } from "../_components/ContactCta";
import { HANDELSBETINGELSER as B } from "@/lib/handelsbetingelser";

export const metadata: Metadata = {
  title: B.metaTitle,
  description: B.metaDescription,
  alternates: { canonical: B.path },
  robots: { index: true, follow: true },
};

export default function HandelsbetingelserPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Forside", href: "/" }, { name: B.h1 }]} />

      <section className="pt-10 pb-12 md:pt-16 md:pb-20 border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="eyebrow-accent mb-6">{B.eyebrow}</div>
          <h1 className="display-lg max-w-4xl">
            Når prisen <span style={{ color: "var(--color-blue)" }}>flytter sig</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
            {B.intro}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10 prose-body">
          {B.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.items && (
                <ul className="mt-4">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "2rem" }}>
            Senest opdateret: september 2026
          </p>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
