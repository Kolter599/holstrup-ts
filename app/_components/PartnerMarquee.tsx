"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { PARTNERS, type Partner } from "@/lib/site";

type Props = {
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
};

export function PartnerMarquee({ compact = false, showHeader = true, className = "" }: Props) {
  const items = [...PARTNERS, ...PARTNERS];
  const heightClass = compact ? "h-12" : "h-16 md:h-20";
  const logoHeightClass = compact ? "h-6" : "h-10 md:h-14";
  const wordmarkSize = compact ? "text-xl" : "text-3xl md:text-4xl";
  const headerPadding = compact ? "pt-6" : "pt-12 md:pt-16";
  const bottomPadding = compact ? "pb-6" : "pb-12 md:pb-16";
  return (
    <section className={`border-y border-[color:var(--color-line)] bg-[color:var(--color-surface)] ${className}`}>
      {showHeader && (
        <div className={`mx-auto max-w-7xl px-6 md:px-10 ${headerPadding}`}>
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4 md:mb-8">
            <span className="eyebrow-accent">↳ VI HAR BYGGET FOR</span>
            {!compact && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">
                — hustømrer, underentreprenør og direkte leverandør på projekter i Storkøbenhavn og Nordsjælland
              </span>
            )}
          </div>
        </div>
      )}
      <div className={`overflow-hidden marquee-pause ${bottomPadding} ${!showHeader ? (compact ? "pt-6" : "pt-12 md:pt-16") : ""}`}>
        <div className="marquee marquee-fast whitespace-nowrap items-center">
          {items.map((p, i) => (
            <span key={i} className={`inline-flex items-center ${compact ? "gap-7 px-6" : "gap-12 px-10"} ${heightClass}`}>
              <Mark partner={p} logoHeightClass={logoHeightClass} wordmarkSize={wordmarkSize} />
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mark({
  partner,
  logoHeightClass,
  wordmarkSize,
}: {
  partner: Partner;
  logoHeightClass: string;
  wordmarkSize: string;
}) {
  const [broken, setBroken] = useState(false);
  if (partner.logo && !broken) {
    return (
      <img
        src={partner.logo}
        alt={partner.name}
        onError={() => setBroken(true)}
        className={`${logoHeightClass} w-auto object-contain`}
        style={{ filter: "grayscale(100%) contrast(1.05)", opacity: 0.85, maxWidth: "180px" }}
      />
    );
  }
  return (
    <span className={`font-display font-extrabold text-[color:var(--color-ink)] tracking-tight ${wordmarkSize}`}>
      {partner.name}
    </span>
  );
}
