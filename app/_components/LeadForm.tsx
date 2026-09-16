"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import {
  SERVICE_GROUPS,
  composeService,
  detailForSlug,
  groupForSlug,
  type ServiceGroup,
} from "@/lib/service-groups";

type Status = "idle" | "sending" | "error";
type Photo = { file: File; preview: string };

const SESSION_KEY = "holstrup_visitor_id";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;
/** Sticky header is 80px; leave the description just below it after expanding. */
const SCROLL_OFFSET = 96;

export type LeadFormProps = {
  /** "full" on /kontakt, "inline" at the bottom of content pages. */
  variant?: "full" | "inline";
  /** Service slug of the page this form sits on — preselects the chip. */
  serviceSlug?: string;
  /** Path the lead came from, so Finn can see which page produced it. */
  source?: string;
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

export function LeadForm({
  variant = "full",
  serviceSlug,
  source,
  photosEnabled = true,
}: LeadFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [group, setGroup] = useState<ServiceGroup | null>(groupForSlug(serviceSlug));
  const [detail, setDetail] = useState(detailForSlug(serviceSlug));
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ phone?: boolean; email?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const sessionIdRef = useRef("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLFormElement>(null);
  const partialSentRef = useRef(false);

  const service = composeService(group, detail);
  const pagePath = source ?? "/kontakt";

  const snapshotRef = useRef({ name, phone, email, message, service, expanded });
  snapshotRef.current = { name, phone, email, message, service, expanded };

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    // /kontakt?ydelse=<slug> — an inline form gets the same thing via props.
    if (serviceSlug) return;
    try {
      const slug = new URLSearchParams(window.location.search).get("ydelse") ?? undefined;
      const preset = groupForSlug(slug);
      if (preset) {
        setGroup(preset);
        setDetail(detailForSlug(slug));
      }
    } catch {
      /* no query string, no problem */
    }
  }, [serviceSlug]);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), [photos]);

  // Autosave as they type, so a partial row exists even if they never click on.
  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (!name && !phone && !email && !message && !service) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      void fetch("/api/contact-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name,
          phone,
          email,
          message,
          service,
          source: pagePath,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [name, phone, email, message, service, pagePath]);

  /**
   * Clicking "Beskriv opgaven" IS the lead: from here on we can reach them.
   * The mail goes out on that click — not on a timer, not on unload. If they
   * never describe the job, Finn already has the name, number and service.
   */
  function notifyPartial() {
    if (partialSentRef.current || !sessionIdRef.current) return;
    partialSentRef.current = true;
    const s = snapshotRef.current;
    void fetch("/api/contact-partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        name: s.name,
        phone: s.phone,
        email: s.email,
        service: s.service,
        source: pagePath,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  // Backup only: they filled in a number and closed the tab before clicking on.
  useEffect(() => {
    function onLeave() {
      const s = snapshotRef.current;
      if (partialSentRef.current || s.expanded) return;
      if (!phoneOk(s.phone) && !emailOk(s.email)) return;
      if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
      partialSentRef.current = true;
      navigator.sendBeacon(
        "/api/contact-partial",
        new Blob(
          [
            JSON.stringify({
              sessionId: sessionIdRef.current,
              name: s.name,
              phone: s.phone,
              email: s.email,
              service: s.service,
              source: pagePath,
            }),
          ],
          { type: "application/json" },
        ),
      );
    }
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [pagePath]);

  // On phones the panel grows downwards, so bring the description into view
  // while leaving their own details visible above it. On desktop the panel
  // widens sideways instead and nothing needs to move.
  useEffect(() => {
    if (!expanded || !detailsRef.current) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const el = detailsRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
        behavior: reduce ? "auto" : "smooth",
      });
    });
  }, [expanded]);

  const phoneError = touched.phone && !phoneOk(phone) ? "Skriv et telefonnummer på 8 cifre." : null;
  const emailError =
    touched.email && email.trim() && !emailOk(email) ? "E-mailen ser ikke rigtig ud." : null;

  function expand(e: React.FormEvent) {
    e.preventDefault();
    setTouched((t) => ({ ...t, phone: true }));
    if (!phoneOk(phone)) return;
    notifyPartial();
    setExpanded(true);
  }

  function chooseGroup(g: ServiceGroup) {
    if (g === group) return;
    setGroup(g);
    // They just corrected us — the slug we came in with no longer describes it.
    setDetail("");
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setPhotoError(null);
    const next = [...photos];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_PHOTOS) {
        setPhotoError(`Max ${MAX_PHOTOS} billeder.`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        setPhotoError("Kun billed-filer (jpg, png, heic).");
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        setPhotoError(`Billeder skal være under ${MAX_PHOTO_SIZE_MB} MB.`);
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setServerMessage("");

    const out = new FormData();
    out.set("name", name.trim());
    out.set("email", email.trim());
    out.set("phone", phone.trim());
    out.set("service", service);
    out.set("message", message.trim());
    out.set("source", pagePath);
    out.set("sessionId", sessionIdRef.current);
    photos.forEach((p, i) => out.append(`photo_${i}`, p.file, p.file.name));

    try {
      const res = await fetch("/api/contact", { method: "POST", body: out });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setServerMessage(json.error || "Noget gik galt. Prøv igen, eller ring direkte.");
        return;
      }
      setStatus("idle");
      setDone(true);
    } catch {
      setStatus("error");
      setServerMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  const firstName = name.trim().split(" ")[0];
  const compact = variant === "inline";

  return (
    <div
      className={
        "mx-auto w-full transition-[max-width] duration-500 ease-out max-w-[680px] " +
        (expanded && !done ? "lg:max-w-[1160px]" : "")
      }
    >
      <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        {done ? (
          <Done firstName={firstName} />
        ) : (
          <div
            className={
              (compact ? "px-5 py-6 md:px-8 md:py-8 " : "px-6 py-8 md:px-10 md:py-10 ") +
              // Widen into two columns instead of reflowing what they typed:
              // the left column keeps exactly the width it had.
              (expanded ? "lg:grid lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:gap-10" : "")
            }
          >
            {/* ---------------- contact details, always visible ---------------- */}
            <form onSubmit={expand} noValidate className="space-y-5">
              <div className={compact ? "" : "text-center"}>
                <h2
                  className={
                    "font-display font-extrabold leading-tight text-[color:var(--color-ink)] " +
                    (compact ? "text-xl md:text-2xl" : "text-2xl md:text-[1.9rem]")
                  }
                >
                  Få et uforpligtende tilbud
                </h2>
                <p
                  className={
                    "mt-2 text-sm text-[color:var(--color-ink-soft)] " +
                    (compact ? "" : "mx-auto max-w-sm")
                  }
                >
                  Vi ringer typisk samme dag. Du forpligter dig til intet.
                </p>
              </div>

              <Field label="Navn" value={name} onChange={setName} autoComplete="name" placeholder="Fornavn Efternavn" />
              <Field
                label="Telefon"
                required
                value={phone}
                onChange={setPhone}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="20 40 60 80"
                error={phoneError}
              />
              <Field
                label="E-mail"
                optional
                value={email}
                onChange={setEmail}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
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
                    className="h-[60px] w-full rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    Beskriv opgaven →
                  </button>
                  <p className="text-center text-xs text-[color:var(--color-muted)]">
                    Ved at klikke videre giver du lov til, at vi må kontakte dig om opgaven.
                  </p>
                  <div className="!my-6 h-px w-full bg-[color:var(--color-line)]" />
                  <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
                    Eller ring:{" "}
                    <a href={`tel:${SITE.phone}`} className="font-semibold text-[color:var(--color-blue)]">
                      {SITE.phoneDisplay}
                    </a>
                  </p>
                </>
              )}
            </form>

            {/* ------------- the job: grows down on phones, sideways on desktop ------------- */}
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
                    Jo flere detaljer, jo nemmere er det for os.
                  </p>
                </div>

                <fieldset className="grid gap-2">
                  <legend className="text-sm font-medium text-[color:var(--color-ink)]">
                    Hvad drejer det sig om?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_GROUPS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => chooseGroup(g)}
                        aria-pressed={group === g}
                        className={
                          "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors " +
                          (group === g
                            ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.06] text-[color:var(--color-blue)]"
                            : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-blue)]")
                        }
                      >
                        {g}
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Fx 'Nyt tag på 110 m² hus — eternit der trænger til udskiftning.'"
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
                    {photos.length > 0 ? (
                      <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {photos.map((p, i) => (
                          <li
                            key={i}
                            className="relative aspect-square overflow-hidden rounded-md border border-[color:var(--color-line)] bg-white"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setPhotos((prev) => {
                                  const next = [...prev];
                                  const [removed] = next.splice(i, 1);
                                  if (removed) URL.revokeObjectURL(removed.preview);
                                  return next;
                                })
                              }
                              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-xs text-white hover:bg-black"
                              aria-label="Fjern billede"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {photoError ? <p className="text-xs text-red-600">{photoError}</p> : null}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-[60px] w-full rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "sending" ? "Sender…" : "Send til Holstrup"}
                </button>

                {status === "error" && serverMessage ? (
                  <p className="text-sm text-red-600">{serverMessage}</p>
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

function Done({ firstName }: { firstName: string }) {
  return (
    <div className="space-y-4 px-6 py-10 text-center md:px-10">
      <div
        className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: "var(--color-blue)" }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
        Tak{firstName ? `, ${firstName}` : ""} — vi er på det
      </h2>
      <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-soft)]">
        Finn har modtaget din besked og vender personligt tilbage — typisk samme dag. Haster det, så
        ring på{" "}
        <a href={`tel:${SITE.phone}`} className="font-medium text-[color:var(--color-blue)]">
          {SITE.phoneDisplay}
        </a>
        .
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
    <label className="grid gap-2">
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
          "rounded-md border bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] " +
          (error ? "border-red-500" : "border-[color:var(--color-line)]")
        }
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
