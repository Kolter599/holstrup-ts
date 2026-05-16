import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Få et tilbud — Holstrup TS",
  description:
    "Få et uforpligtende tilbud fra Holstrup TS. Beskriv din opgave i 4 hurtige skridt — Finn vender personligt tilbage, typisk samme dag.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <section className="py-24 md:py-32">
      {/* Wide headline — intentionally breaks out past the form so it reads grand */}
      <header className="mx-auto w-full max-w-5xl px-6 text-center md:px-10">
        <h1 className="font-display font-extrabold leading-[0.95] tracking-[-0.02em] text-[clamp(3rem,8vw,6.5rem)]">
          Få et tilbud fra <span style={{ color: "var(--color-blue)" }}>Finn</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[color:var(--color-ink-soft)] text-base md:text-lg">
          4 hurtige skridt — under et minut.
        </p>
      </header>

      {/* Form stays constrained so the headline visually overflows it */}
      <div className="mx-auto mt-12 w-full max-w-[680px] px-6 md:mt-16 md:px-8">
        <ContactForm />
      </div>
    </section>
  );
}
