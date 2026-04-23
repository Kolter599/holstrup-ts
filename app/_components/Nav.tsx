"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/ydelser", label: "Ydelser" },
  { href: "/projekter", label: "Projekter" },
  { href: "/omraader", label: "Områder" },
  { href: "/om", label: "Om" },
  { href: "/blog", label: "Viden" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-[color:var(--color-line)] supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/holstrup-logo.png"
              alt="Holstrup TS"
              width={220}
              height={44}
              className="h-9 md:h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[15px]">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`transition-colors font-medium ${active ? "text-[color:var(--color-blue)]" : "text-[color:var(--color-ink)] hover:text-[color:var(--color-blue)]"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/kontakt" className="btn-accent py-2.5 px-5 text-sm">
              Indhent tilbud
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-[color:var(--color-ink)]"
          >
            <span aria-hidden className="relative block w-6 h-[2px] bg-current">
              <span className="absolute left-0 top-[-7px] block w-6 h-[2px] bg-current transition-transform" style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span className="absolute left-0 top-[7px] block w-6 h-[2px] bg-current transition-transform" style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
              <span className="block w-6 h-[2px] bg-current transition-opacity" style={{ opacity: open ? 0 : 1 }} />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-[color:var(--color-ink)]/40" onClick={() => setOpen(false)} />
        <div className={`absolute top-20 inset-x-0 bg-white border-b border-[color:var(--color-line)] transition-transform duration-300 ${open ? "translate-y-0" : "-translate-y-4"}`}>
          <nav className="px-6 py-8 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-display font-bold text-3xl py-4 border-b border-[color:var(--color-line)] ${pathname?.startsWith(l.href) ? "text-[color:var(--color-blue)]" : "text-[color:var(--color-ink)]"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/kontakt" className="btn-accent mt-8 justify-center">
              Indhent tilbud
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
