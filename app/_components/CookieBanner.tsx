"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "holstrup-cookies-accepted";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="mx-auto max-w-3xl bg-white border border-[color:var(--color-line-strong)] shadow-xl rounded-lg p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 pointer-events-auto">
        <p className="text-[color:var(--color-ink)] text-sm md:text-[15px] leading-relaxed flex-1">
          Vi bruger cookies til at måle besøg på sitet — ikke til at vise dig reklamer.{" "}
          <Link href="/cookies" className="text-[color:var(--color-blue)] underline underline-offset-2 hover:no-underline">
            Læs mere
          </Link>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-accent shrink-0 justify-center"
        >
          OK, det er fint
        </button>
      </div>
    </div>
  );
}
