import Link from "next/link";
import { SITE } from "@/lib/site";

type Props = {
  heading?: React.ReactNode;
  body?: string;
  primaryLabel?: string;
  variant?: "blue" | "dark";
};

export function ContactCta({
  heading = <>Ring til <span style={{ color: "var(--color-accent)" }}>Finn</span> personligt.</>,
  body = "Den bedste måde at vurdere en opgave på er en ærlig snak. Ring direkte, eller send besked gennem kontaktformularen.",
  primaryLabel = "Indhent tilbud",
  variant = "blue",
}: Props) {
  return (
    <section className={variant === "blue" ? "band-blue" : "band-dark"}>
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-36 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <div className="eyebrow mb-6" style={{ color: "var(--color-accent)" }}>Næste skridt</div>
          <h2 className="display-lg" style={{ color: "white" }}>{heading}</h2>
          <p className="mt-6 text-white/80 text-lg max-w-xl leading-relaxed">{body}</p>
        </div>
        <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
          <Link href="/kontakt" className="btn-accent w-fit">
            {primaryLabel}
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors text-sm w-fit"
          >
            Ring {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
