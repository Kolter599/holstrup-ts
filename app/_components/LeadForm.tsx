"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import {
  CUSTOMER_TYPES,
  composeService,
  detailForSlug,
  groupForSlug,
} from "@/lib/service-groups";
import { claimSource, patch, resetForPath, useLeadState } from "@/lib/lead-form-store";

const SESSION_KEY = "holstrup_visitor_id";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;
/** Sticky header is 80px; land the target just below it. */
const SCROLL_OFFSET = 96;

export type LeadFormProps = {
  /** Unique per placement on a page — also the anchor id for the handoff. */
  id: string;
  /** "compact" sits beside the promise; "full" is the wide one after the proof. */
  variant?: "full" | "compact";
  /** Id of the placement that should open instead of this one. */
  handoffTo?: string;
  /** Service slug of the page this form sits on — preselects the chip. */
  serviceSlug?: string;
  /** Where this placement sits, e.g. /ydelser/tagrenovering#top. */
  source: string;
  /** False when no Blob store is connected — hides the upload, rest still works. */
  photosEnabled?: boolean;
};

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

/** Same rule as the server: 8–15 digits. */
function phoneOk(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function emailOk(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function scrollTo(el: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
    behavior: reduce ? "auto" : "smooth",
  });
}

export function LeadForm({
  id,
  variant = "full",
  handoffTo,
  serviceSlug,
  source,
  photosEnabled = true,
}: LeadFormProps) {
  const s = useLeadState();
  const pathname = usePathname();
  const compact = variant === "compact";

  const sessionIdRef = useRef("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLFormElement>(null);

  const service = composeService(s.group, s.detail, s.customerType);
  const expanded = s.expandedId === id;

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    const slugFromQuery = (() => {
      if (serviceSlug) return serviceSlug;
      try {
        return new URLSearchParams(window.location.search).get("ydelse") ?? undefined;
      } catch {
        return undefined;
      }
    })();
    resetForPath(pathname ?? "", groupForSlug(slugFromQuery), detailForSlug(slugFromQuery));
  }, [pathname, serviceSlug]);

  // Only the placement they are actually typing in talks to the server, so two
  // forms on one page never race each other with two drafts.
  const owns = s.activeId === id;
  useEffect(() => {
    if (!owns || !sessionIdRef.current) return;
    if (!s.name && !s.phone && !s.email && !s.message && !service) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      void fetch("/api/contact-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name: s.name,
          phone: s.phone,
          email: s.email,
          message: s.message,
          service,
          source: s.leadSource || source,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [owns, s.name, s.phone, s.email, s.message, s.leadSource, service, source]);

  // Backup only: a number typed in, then the tab closed before clicking on.
  useEffect(() => {
    function onLeave() {
      if (!owns || s.partialSent || s.expandedId) return;
      if (!phoneOk(s.phone) && !emailOk(s.email)) return;
      if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
      patch({ partialSent: true });
      navigator.sendBeacon(
        "/api/contact-partial",
        new Blob(
          [
            JSON.stringify({
              sessionId: sessionIdRef.current,
              name: s.name,
              phone: s.phone,
              email: s.email,
              service,
              source: s.leadSource || source,
            }),
          ],
          { type: "application/json" },
        ),
      );
    }
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  });

  // Whoever just opened brings itself into view: the whole panel after a
  // handoff, otherwise (phones only) the description, so their own details
  // stay visible above it. Desktop widens sideways and needs no scrolling.
  useEffect(() => {
    if (!expanded) return;
    const handedOff = s.pendingScroll === id;
    if (handedOff) patch({ pendingScroll: null });
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const el = handedOff ? wrapperRef.current : desktop ? null : detailsRef.current;
    if (!el) return;
    requestAnimationFrame(() => scrollTo(el));
  }, [expanded, s.pendingScroll, id]);

  function edit(next: Parameters<typeof patch>[0]) {
    claimSource(id, source);
    patch(next);
  }

  /**
   * Clicking "Beskriv opgaven" IS the lead: from here on we can reach them, so
   * the mail goes out on that click. A compact placement hands the job over to
   * the wide one — same state, so nothing they typed is lost.
   */
  function expand(e: React.FormEvent) {
    e.preventDefault();
    patch({ touched: { ...s.touched, phone: true } });
    if (!phoneOk(s.phone)) return;

    const target = handoffTo ?? id;
    if (!s.partialSent && sessionIdRef.current) {
      patch({ partialSent: true });
      void fetch("/api/contact-partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name: s.name,
          phone: s.phone,
          email: s.email,
          service,
          source: s.leadSource || source,
        }),
        keepalive: true,
      }).catch(() => {});
    }
    patch({ expandedId: target, pendingScroll: target === id ? null : target });
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next = [...s.photos];
    let err: string | null = null;
    for (const file of Array.from(list)) {
      if (next.length >= MAX_PHOTOS) {
        err = `Max ${MAX_PHOTOS} billeder.`;
        break;
      }
      if (!file.type.startsWith("image/")) {
        err = "Kun billed-filer (jpg, png, heic).";
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        err = `Billeder skal være under ${MAX_PHOTO_SIZE_MB} MB.`;
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    patch({ photos: next, photoError: err });
  }

  function removePhoto(index: number) {
    const next = [...s.photos];
    const [removed] = next.splice(index, 1);
    if (removed) URL.revokeObjectURL(removed.preview);
    patch({ photos: next });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (s.status === "sending") return;
    patch({ status: "sending", serverMessage: "" });

    const out = new FormData();
    out.set("name", s.name.trim());
    out.set("email", s.email.trim());
    out.set("phone", s.phone.trim());
    out.set("service", service);
    out.set("message", s.message.trim());
    out.set("source", s.leadSource || source);
    out.set("sessionId", sessionIdRef.current);
    s.photos.forEach((p, i) => out.append(`photo_${i}`, p.file, p.file.name));

    try {
      const res = await fetch("/api/contact", { method: "POST", body: out });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        patch({
          status: "error",
          serverMessage: json.error || "Noget gik galt. Prøv igen, eller ring direkte.",
        });
        return;
      }
      patch({ status: "idle", done: true });
    } catch {
      patch({
        status: "error",
        serverMessage: "Kunne ikke sende. Tjek din forbindelse, eller ring direkte.",
      });
    }
  }

  const phoneError =
    s.touched.phone && !phoneOk(s.phone) ? "Skriv et telefonnummer på 8 cifre." : null;
  const emailError =
    s.touched.email && s.email.trim() && !emailOk(s.email) ? "E-mailen ser ikke rigtig ud." : null;
  const firstName = s.name.trim().split(" ")[0];

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={
        "mx-auto w-full scroll-mt-28 transition-[max-width] duration-500 ease-out " +
        (compact ? "max-w-full " : "max-w-[680px] ") +
        (expanded && !s.done && !compact ? "lg:max-w-[1160px]" : "")
      }
    >
      <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        {s.done ? (
          <Done firstName={firstName} compact={compact} />
        ) : (
          <div
            className={
              (compact ? "px-5 py-6 " : "px-6 py-8 md:px-10 md:py-10 ") +
              (expanded && !compact
                ? "lg:grid lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:gap-10"
                : "")
            }
          >
            <form onSubmit={expand} noValidate className="space-y-4">
              <div className={compact ? "" : "space-y-1 text-center"}>
                <h2
                  className={
                    "font-display font-extrabold leading-tight text-[color:var(--color-ink)] " +
                    (compact ? "text-lg" : "text-2xl md:text-[1.9rem]")
                  }
                >
                  Få et uforpligtende tilbud
                </h2>
                <p
                  className={
                    "text-sm text-[color:var(--color-ink-soft)] " +
                    (compact ? "mt-1" : "mx-auto max-w-sm pt-1")
                  }
                >
                  Vi ringer typisk samme dag. Du forpligter dig til intet.
                </p>
              </div>

              <Field
                label="Navn"
                value={s.name}
                onChange={(v) => edit({ name: v })}
                autoComplete="name"
                placeholder="Fornavn Efternavn"
              />
              <Field
                label="Telefon"
                required
                value={s.phone}
                onChange={(v) => edit({ phone: v })}
                onBlur={() => patch({ touched: { ...s.touched, phone: true } })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="20 40 60 80"
                error={phoneError}
              />
              <Field
                label="E-mail"
                optional
                value={s.email}
                onChange={(v) => edit({ email: v })}
                onBlur={() => patch({ touched: { ...s.touched, email: true } })}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="dig@eksempel.dk"
                error={emailError}
              />

              {expanded ? null : (
                <>
                  <button
                    type="submit"
                    className={
                      "w-full rounded-md bg-[color:var(--color-blue)] px-5 font-semibold text-white transition-opacity hover:opacity-95 " +
                      (compact ? "h-[52px] text-[15px]" : "h-[60px] text-base")
                    }
                  >
                    Beskriv opgaven →
                  </button>
                  <p className="text-center text-xs text-[color:var(--color-muted)]">
                    Ved at klikke videre giver du lov til, at vi må kontakte dig om opgaven.
                  </p>
                  <div className="!my-5 h-px w-full bg-[color:var(--color-line)]" />
                  <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
                    Eller ring:{" "}
                    <a href={`tel:${SITE.phone}`} className="font-semibold text-[color:var(--color-blue)]">
                      {SITE.phoneDisplay}
                    </a>
                  </p>
                </>
              )}
            </form>

            {expanded ? (
              <form
                onSubmit={submit}
                noValidate
                ref={detailsRef}
                className="mt-8 space-y-6 border-t border-[color:var(--color-line)] pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              >
                <div>
                  <h3 className="font-display text-xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-2xl">
                    {firstName ? `Tak, ${firstName}. ` : ""}Beskriv opgaven, så kommer vi med et
                    tilbud.
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
                    Jo flere detaljer, jo nemmere er det for os. Skriv gerne hvilken by opgaven er i.
                  </p>
                </div>

                <fieldset className="grid gap-2">
                  <legend className="text-sm font-medium text-[color:var(--color-ink)]">
                    Er du privat eller erhverv?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOMER_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => edit({ customerType: t })}
                        aria-pressed={s.customerType === t}
                        className={
                          "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors " +
                          (s.customerType === t
                            ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.06] text-[color:var(--color-blue)]"
                            : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-blue)]")
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[color:var(--color-ink)]">
                    Hvad skal der laves?
                  </span>
                  <textarea
                    rows={5}
                    value={s.message}
                    onChange={(e) => edit({ message: e.target.value })}
                    placeholder={"Fx 'Nyt tag på 110 m\u00b2 hus i Hiller\u00f8d \u2014 eternit der tr\u00e6nger til udskiftning.'\n\nSkriv gerne hvor i landet opgaven er, s\u00e5 kan vi sige noget om tid og pris med det samme."}
                    className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
                  />
                </label>

                {photosEnabled ? (
                  <div className="grid gap-2">
                    <span className="text-sm font-medium text-[color:var(--color-ink)]">
                      Billeder{" "}
                      <span className="font-normal text-[color:var(--color-muted)]">(valgfrit)</span>
                    </span>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        addFiles(e.dataTransfer.files);
                      }}
                      className="rounded-md border-2 border-dashed border-[color:var(--color-line)] bg-white/50 p-5 text-center transition-colors hover:border-[color:var(--color-blue)]"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          addFiles(e.target.files);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="font-medium text-[color:var(--color-blue)] hover:underline"
                      >
                        Vælg billeder
                      </button>
                      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                        Et billede af taget eller vinduet hjælper os meget.
                      </p>
                    </div>
                    {s.photos.length > 0 ? (
                      <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {s.photos.map((p, i) => (
                          <li
                            key={p.preview}
                            className="relative aspect-square overflow-hidden rounded-md border border-[color:var(--color-line)] bg-white"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-xs text-white hover:bg-black"
                              aria-label="Fjern billede"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {s.photoError ? <p className="text-xs text-red-600">{s.photoError}</p> : null}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={s.status === "sending"}
                  className="h-[60px] w-full rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {s.status === "sending" ? "Sender…" : "Send til Holstrup"}
                </button>

                {s.status === "error" && s.serverMessage ? (
                  <p className="text-sm text-red-600">{s.serverMessage}</p>
                ) : null}
              </form>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );

}

/* --------------------------------- pieces -------------------------------- */

function Done({ firstName, compact }: { firstName: string; compact: boolean }) {
  return (
    <div className={"space-y-3 text-center " + (compact ? "px-5 py-8" : "px-6 py-10 md:px-10")}>
      <div
        className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: "var(--color-blue)" }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2
        className={
          "font-display font-extrabold leading-tight text-[color:var(--color-ink)] " +
          (compact ? "text-lg" : "text-2xl md:text-[1.9rem]")
        }
      >
        Tak{firstName ? `, ${firstName}` : ""} — vi har modtaget din besked
      </h2>
      <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-soft)]">
        Gem gerne vores nummer{" "}
        <a href={`tel:${SITE.phone}`} className="font-medium text-[color:var(--color-blue)]">
          {SITE.phoneDisplay}
        </a>
        . Vi ringer som regel op for at tale opgaven igennem, før vi giver et endeligt tilbud — så
        ved du, hvem der er i røret.
      </p>
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  error,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
  error?: string | null;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-[color:var(--color-ink)]">
        {label}
        {required ? <span className="text-[color:var(--color-muted)]"> *</span> : null}
        {optional ? <span className="font-normal text-[color:var(--color-muted)]"> (valgfrit)</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        className={
          "rounded-md border bg-white p-3.5 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] " +
          (error ? "border-red-500" : "border-[color:var(--color-line)]")
        }
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
