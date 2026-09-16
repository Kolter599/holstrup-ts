"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES, SITE } from "@/lib/site";

type Status = "idle" | "sending" | "error";
type Step = "kontakt" | "opgave" | "done";
type Photo = { file: File; preview: string };

const SESSION_KEY = "holstrup_visitor_id";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;

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

export function ContactForm({ photosEnabled = true }: { photosEnabled?: boolean }) {
  const [step, setStep] = useState<Step>("kontakt");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ phone?: boolean; email?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const sessionIdRef = useRef("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partialSentRef = useRef(false);

  const snapshotRef = useRef({ name, phone, email, message, service, step });
  snapshotRef.current = { name, phone, email, message, service, step };

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    // Arrived from /ydelser/<slug>? The service rides along silently — they
    // already told us what it is by being on that page.
    try {
      const slug = new URLSearchParams(window.location.search).get("ydelse");
      const match = slug ? SERVICES.find((s) => s.slug === slug) : null;
      if (match) setService(match.title);
    } catch {
      /* no query string, no problem */
    }
  }, []);

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
        body: JSON.stringify({ sessionId: sessionIdRef.current, name, phone, email, message, service }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [name, phone, email, message, service]);

  /**
   * Clicking "Beskriv opgaven" IS the lead: from here on we can reach them.
   * The mail goes out on that click — not on a timer, not on unload. If they
   * never finish step 2, Finn already has the name, number and service.
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
      }),
      keepalive: true,
    }).catch(() => {});
  }

  // Backup only: they filled in a number on step 1 and closed the tab.
  useEffect(() => {
    function onLeave() {
      const s = snapshotRef.current;
      if (partialSentRef.current || s.step !== "kontakt") return;
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
            }),
          ],
          { type: "application/json" },
        ),
      );
    }
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, []);

  const phoneError = touched.phone && !phoneOk(phone) ? "Skriv et telefonnummer på 8 cifre." : null;
  const emailError =
    touched.email && email.trim() && !emailOk(email) ? "E-mailen ser ikke rigtig ud." : null;

  function goToStep2(e: React.FormEvent) {
    e.preventDefault();
    setTouched((t) => ({ ...t, phone: true }));
    if (!phoneOk(phone)) return;
    notifyPartial();
    setStep("opgave");
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
      setStep("done");
    } catch {
      setStatus("error");
      setServerMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  const firstName = name.trim().split(" ")[0];

  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
      <div className="px-6 py-8 md:px-10 md:py-10">
        {step === "kontakt" ? (
          <form onSubmit={goToStep2} noValidate className="space-y-5">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
                Få et uforpligtende tilbud
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-soft)]">
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

            <button
              type="submit"
              className="h-[60px] w-full rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95"
            >
              Beskriv opgaven →
            </button>
            <p className="text-center text-xs text-[color:var(--color-muted)]">
              Ved at klikke videre giver du lov til, at vi må kontakte dig om opgaven.
            </p>

            <div className="hairline !my-6 h-px w-full bg-[color:var(--color-line)]" />
            <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
              Eller ring:{" "}
              <a href={`tel:${SITE.phone}`} className="font-semibold text-[color:var(--color-blue)]">
                {SITE.phoneDisplay}
              </a>
            </p>
          </form>
        ) : null}

        {step === "opgave" ? (
          <form onSubmit={submit} noValidate className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
                Tak{firstName ? `, ${firstName}` : ""}. Vi har dine oplysninger.
              </h2>
            </div>

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
                  Billeder <span className="font-normal text-[color:var(--color-muted)]">(valgfrit)</span>
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

            <button
              type="button"
              onClick={() => setStep("kontakt")}
              className="block w-full text-center text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]"
            >
              ← Ret mine oplysninger
            </button>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="space-y-4 py-6 text-center">
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
              Finn har modtaget din besked og vender personligt tilbage — typisk samme dag. Haster
              det, så ring på{" "}
              <a href={`tel:${SITE.phone}`} className="font-medium text-[color:var(--color-blue)]">
                {SITE.phoneDisplay}
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------------- shared -------------------------------- */

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
