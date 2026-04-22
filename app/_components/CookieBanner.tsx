"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "holstrup-cookies-consent";
// Værdier: "all" (analytics OK) | "necessary" (kun nødvendige)

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function setConsent(value: "all" | "necessary") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: value }));
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="mx-auto max-w-3xl bg-white border border-[color:var(--color-line-strong)] shadow-xl rounded-lg p-5 md:p-6 flex flex-col gap-4 pointer-events-auto md:flex-row md:items-center">
        <p className="text-[color:var(--color-ink)] text-sm md:text-[15px] leading-relaxed flex-1">
          Vi bruger cookies til at måle besøg på sitet og forbedre din oplevelse.{" "}
          <Link href="/cookies" className="text-[color:var(--color-blue)] underline underline-offset-2 hover:no-underline">
            Læs mere
          </Link>.
        </p>
        <div className="flex flex-col items-stretch md:items-center gap-2 shrink-0 md:flex-row">
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-blue)] text-white font-semibold text-sm hover:bg-[color:var(--color-blue-deep)] transition-colors order-1"
          >
            OK, det er fint
          </button>
          <button
            type="button"
            onClick={() => setConsent("necessary")}
            className="text-sm text-[color:var(--color-muted)] underline underline-offset-2 hover:text-[color:var(--color-ink)] transition-colors py-2 order-2"
          >
            Kun nødvendige
          </button>
        </div>
      </div>
    </div>
  );
}
