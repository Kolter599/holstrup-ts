"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { PARTNERS, type Partner } from "@/lib/site";

export function PartnerMarquee() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-12 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-8">
          <span className="eyebrow-accent">↳ VI HAR BYGGET FOR</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">
            — hustømrer, underentreprenør og direkte leverandør på projekter i Storkøbenhavn og Nordsjælland
          </span>
        </div>
      </div>
      <div className="overflow-hidden marquee-pause pb-12 md:pb-16">
        <div className="marquee marquee-fast whitespace-nowrap items-center">
          {items.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-12 px-10 h-16 md:h-20">
              <Mark partner={p} />
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mark({ partner }: { partner: Partner }) {
  const [broken, setBroken] = useState(false);
  if (partner.logo && !broken) {
    return (
      <img
        src={partner.logo}
        alt={partner.name}
        onError={() => setBroken(true)}
        className="h-10 md:h-14 w-auto object-contain"
        style={{ filter: "grayscale(100%) contrast(1.05)", opacity: 0.85 }}
      />
    );
  }
  return (
    <span className="font-display font-extrabold text-[color:var(--color-ink)] tracking-tight text-3xl md:text-4xl">
      {partner.name}
    </span>
  );
}
