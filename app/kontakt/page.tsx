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
      <div className="mx-auto w-full max-w-[680px] px-6 md:px-8">
        <header className="mb-10 text-center md:mb-14">
          <h1 className="display-lg leading-[1.05]">
            Få et tilbud fra <span style={{ color: "var(--color-blue)" }}>Finn</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[color:var(--color-ink-soft)] text-base md:text-lg">
            4 hurtige skridt — under et minut.
          </p>
        </header>

        <ContactForm />
      </div>
    </section>
  );
}
