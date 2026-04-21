"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { PARTNERS, type Partner } from "@/lib/site";

type Props = { compact?: boolean };

export function PartnerRow({ compact = false }: Props) {
  const items = PARTNERS.filter((p) => p.inRow);
  const heightClass = compact ? "h-6 md:h-7" : "h-7 md:h-8";
  return (
    <div className="flex flex-wrap items-center gap-x-10 md:gap-x-14 gap-y-6">
      {items.map((p) => (
        <RowMark key={p.name} partner={p} heightClass={heightClass} />
      ))}
    </div>
  );
}

function RowMark({ partner, heightClass }: { partner: Partner; heightClass: string }) {
  const [broken, setBroken] = useState(false);
  if (partner.logo && !broken) {
    return (
      <img
        src={partner.logo}
        alt={partner.name}
        onError={() => setBroken(true)}
        className={`${heightClass} w-auto object-contain opacity-60 hover:opacity-100 transition-opacity`}
        style={{ filter: "grayscale(100%) contrast(1.05)", maxWidth: "120px" }}
      />
    );
  }
  return (
    <span className="font-display font-extrabold text-[color:var(--color-muted)] tracking-tight text-base md:text-lg">
      {partner.name}
    </span>
  );
}
