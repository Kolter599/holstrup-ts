"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE } from "@/lib/site";
import { SERVICE_TILES_ERHVERV, SERVICE_TILES_PRIVAT, tileForSlug } from "./services";

type Status = "idle" | "sending" | "sent" | "error";
type Audience = "privat" | "erhverv";
type CallTime = "asap" | "formiddag" | "eftermiddag" | "aften";

const SESSION_KEY = "holstrup_visitor_id";
/** Grace period between "they moved on" and the alert, so Send wins the race. */
const PARTIAL_DELAY_MS = 10_000;

const CALL_TIMES: Array<{ value: CallTime; label: string }> = [
  { value: "asap", label: "Hurtigst muligt" },
  { value: "formiddag", label: "Formiddag" },
  { value: "eftermiddag", label: "Eftermiddag" },
  { value: "aften", label: "Efter 16" },
];

const CALL_TIME_TEXT: Record<CallTime, string> = {
  asap: "hurtigst muligt",
  formiddag: "formiddag (8–12)",
  eftermiddag: "eftermiddag (12–16)",
  aften: "efter kl. 16",
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

export function ContactForm() {
  const [audience, setAudience] = useState<Audience>("privat");
  const [service, setService] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [callTime, setCallTime] = useState<CallTime>("asap");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showMore, setShowMore] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const sessionIdRef = useRef<string>("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest snapshot for the leave-the-page beacon (avoids stale closures).
  const snapshotRef = useRef({ audience, service, message, name, phone, email, city, company, callTime, status });
  snapshotRef.current = { audience, service, message, name, phone, email, city, company, callTime, status };
  const partialSentRef = useRef(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    // Came from a service page (/ydelser/tagrenovering → ?ydelse=tagrenovering)?
    // Start them one step in with the right box already ticked.
    try {
      const slug = new URLSearchParams(window.location.search).get("ydelse");
      const preset = slug ? tileForSlug(slug) : null;
      if (preset) {
        setAudience(preset.audience);
        setService(preset.value);
      }
    } catch {
      /* no query string, no problem */
    }
  }, []);

  // The moment we can reach them, the lead is real — we don't wait for Send,
  // and we don't rely on an unload beacon (mobile Safari drops those, which is
  // why only 1 of 9 abandoned drafts ever raised an alert). As soon as they
  // move on from the phone/email field, a normal fetch goes out. The short
  // delay only exists so someone who presses Send right away doesn't trigger
  // both mails; submit() cancels it. The server dedupes per session either way.
  const partialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function partialPayload(): string {
    const s = snapshotRef.current;
    return JSON.stringify({
      sessionId: sessionIdRef.current,
      name: s.name,
      email: s.email,
      phone: s.phone,
      city: s.city,
      service: serviceForDraft(s.audience, s.service),
      message: composeMessage(s),
    });
  }

  function reachable(): boolean {
    const s = snapshotRef.current;
    return phoneOk(s.phone) || emailOk(s.email);
  }

  /** Called when they leave a contact field or touch any other control. */
  function movedOn() {
    if (partialSentRef.current || partialTimerRef.current) return;
    if (!sessionIdRef.current || !reachable()) return;
    partialTimerRef.current = setTimeout(() => {
      if (partialSentRef.current) return;
      partialSentRef.current = true;
      void fetch("/api/contact-partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: partialPayload(),
        keepalive: true,
      }).catch(() => {});
    }, PARTIAL_DELAY_MS);
  }

  // Backup for the visitor who closes the tab without touching anything else.
  useEffect(() => {
    function notifyIfAbandoned() {
      if (partialSentRef.current) return;
      const s = snapshotRef.current;
      if (s.status === "sent" || s.status === "sending") return;
      if (!phoneOk(s.phone) && !emailOk(s.email)) return;
      if (!sessionIdRef.current || typeof navigator === "undefined" || !navigator.sendBeacon) return;
      partialSentRef.current = true;
      navigator.sendBeacon(
        "/api/contact-partial",
        new Blob([partialPayload()], { type: "application/json" }),
      );
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") notifyIfAbandoned();
    }
    window.addEventListener("pagehide", notifyIfAbandoned);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", notifyIfAbandoned);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave every keystroke path to holstrup_leads, so a partial is captured
  // even if they never press send.
  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (!service && !message && !name && !phone && !email && !city && !company) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      void fetch("/api/contact-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name,
          email,
          phone,
          city,
          service: serviceForDraft(audience, service),
          message: composeMessage({ audience, company, message, callTime }),
        }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [audience, service, message, name, phone, email, city, company, callTime]);

  const phoneError = touched.phone && !phoneOk(phone) ? "Skriv et telefonnummer på 8 cifre." : null;
  const emailError = touched.email && email.trim() && !emailOk(email) ? "E-mailen ser ikke rigtig ud." : null;
  const canSubmit = phoneOk(phone) && status !== "sending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched((t) => ({ ...t, phone: true }));
    if (!canSubmit) return;
    // They are sending for real — no "næsten færdig" alert on top of it.
    if (partialTimerRef.current) clearTimeout(partialTimerRef.current);
    partialSentRef.current = true;
    setStatus("sending");
    setServerMessage("");

    const out = new FormData();
    out.set("name", name.trim());
    out.set("email", email.trim());
    out.set("phone", phone.trim());
    out.set("city", city.trim());
    out.set("service", serviceForDraft(audience, service));
    out.set("message", composeMessage({ audience, company, message, callTime }));
    out.set("sessionId", sessionIdRef.current);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: out });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setServerMessage(json.error || "Noget gik galt. Prøv igen, eller ring direkte.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setServerMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  if (status === "sent") {
    return <Done name={name} callTime={callTime} sessionId={sessionIdRef.current} />;
  }

  const tiles = audience === "erhverv" ? SERVICE_TILES_ERHVERV : SERVICE_TILES_PRIVAT;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]"
    >
      <div className="border-b border-[color:var(--color-line)] bg-white px-6 py-5 md:px-8 md:py-6">
        <div className="eyebrow-accent">Gratis og uforpligtende</div>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
          Skriv dit nummer — så ringer Finn
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          Du behøver ikke skrive andet. Resten tager vi over telefonen.
        </p>
      </div>

      <div className="space-y-6 px-6 py-7 md:px-10 md:py-9">
        {/* 1 — the only thing we actually need */}
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-[color:var(--color-ink)]">
            Dit telefonnummer
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, phone: true }));
              movedOn();
            }}
            placeholder="20 40 60 80"
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? "phone-error" : undefined}
            className={
              "rounded-md border bg-white p-4 text-lg text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] " +
              (phoneError ? "border-red-500" : "border-[color:var(--color-line)]")
            }
          />
          {phoneError ? (
            <p id="phone-error" className="text-xs text-red-600">
              {phoneError}
            </p>
          ) : null}
        </div>

        {/* 2 — name, nice to have */}
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium text-[color:var(--color-ink)]">
            Dit navn <span className="font-normal text-[color:var(--color-muted)]">(valgfrit)</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            onFocus={movedOn}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fornavn"
            className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
          />
        </div>

        {/* 3 — when to call */}
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-[color:var(--color-ink)]">
            Hvornår passer det at blive ringet op?
          </legend>
          <div className="flex flex-wrap gap-2">
            {CALL_TIMES.map((t) => (
              <Chip
                key={t.value}
                active={callTime === t.value}
                onClick={() => {
                  setCallTime(t.value);
                  movedOn();
                }}
                label={t.label}
              />
            ))}
          </div>
        </fieldset>

        {/* 4 — what it's about, optional */}
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-[color:var(--color-ink)]">
            Hvad drejer det sig om?{" "}
            <span className="font-normal text-[color:var(--color-muted)]">(valgfrit)</span>
          </legend>
          <AudienceToggle
            audience={audience}
            onChange={(a) => {
              if (a === audience) return;
              setAudience(a);
              setService("");
            }}
          />
          <div className="mt-1 flex flex-wrap gap-2">
            {tiles.map((t) => (
              <Chip
                key={t.value}
                active={service === t.value}
                onClick={() => {
                  setService(service === t.value ? "" : t.value);
                  movedOn();
                }}
                label={t.label}
                icon={t.icon}
              />
            ))}
          </div>
        </fieldset>

        {/* 5 — everything else, folded away */}
        {showMore ? (
          <div className="grid gap-4 rounded-md border border-[color:var(--color-line)] bg-white/60 p-4">
            {audience === "erhverv" ? (
              <TextField label="Virksomhed" value={company} onChange={setCompany} autoComplete="organization" placeholder="Firma A/S" />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="E-mail"
                value={email}
                onChange={setEmail}
                onBlur={() => {
                  setTouched((t) => ({ ...t, email: true }));
                  movedOn();
                }}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="dig@eksempel.dk"
                error={emailError}
              />
              <TextField label="By" value={city} onChange={setCity} autoComplete="address-level2" placeholder="Fx Hillerød" />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[color:var(--color-ink)]">Kort om opgaven</span>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Fx 'Nyt tag på 110 m² hus — eternit der trænger til udskiftning.'"
                className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
              />
            </label>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowMore(true);
              movedOn();
            }}
            className="text-sm font-medium text-[color:var(--color-blue)] hover:underline"
          >
            + Tilføj e-mail, by eller en kort beskrivelse
          </button>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-[60px] w-full rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sender…" : "Ring mig op →"}
        </button>

        {status === "error" && serverMessage ? (
          <p className="text-sm text-red-600">{serverMessage}</p>
        ) : null}

        <p className="text-center text-xs text-[color:var(--color-muted)]">
          Vi videregiver ikke dine oplysninger. Vil du hellere ringe selv?{" "}
          <a href={`tel:${SITE.phone}`} className="font-medium text-[color:var(--color-blue)]">
            {SITE.phoneDisplay}
          </a>
        </p>
      </div>
    </form>
  );
}

/* ------------------------------ confirmation ------------------------------ */

function Done({
  name,
  callTime,
  sessionId,
}: {
  name: string;
  callTime: CallTime;
  sessionId: string;
}) {
  const firstName = name.trim().split(" ")[0] || "";
  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
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
          Tak{firstName ? `, ${firstName}` : ""} — Finn ringer {CALL_TIME_TEXT[callTime]}
        </h2>
        <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-soft)]">
          Dit nummer er landet hos Finn. Haster det, kan du ringe direkte på{" "}
          <a href={`tel:${SITE.phone}`} className="font-medium text-[color:var(--color-blue)]">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
      </div>
      <PhotoUpload sessionId={sessionId} />
    </div>
  );
}

/** Photo upload moved to AFTER submit — on mobile it is where people gave up. */
function PhotoUpload({ sessionId }: { sessionId: string }) {
  const MAX_PHOTOS = 5;
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0 || !sessionId) return;
    setState("sending");
    const out = new FormData();
    out.set("sessionId", sessionId);
    Array.from(files)
      .slice(0, MAX_PHOTOS)
      .forEach((f, i) => out.append(`photo_${i}`, f, f.name));
    try {
      const res = await fetch("/api/contact-photos", { method: "POST", body: out });
      if (!res.ok) throw new Error("upload failed");
      const json = (await res.json()) as { count?: number };
      setCount(json.count ?? 0);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border-t border-[color:var(--color-line)] bg-white px-6 py-6 text-center text-sm text-[color:var(--color-ink-soft)] md:px-10">
        Tak — {count} billede{count === 1 ? "" : "r"} er sendt videre til Finn.
      </div>
    );
  }

  return (
    <div className="border-t border-[color:var(--color-line)] bg-white px-6 py-6 text-center md:px-10">
      <p className="text-sm font-medium text-[color:var(--color-ink)]">
        Send gerne billeder bagefter
      </p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-[color:var(--color-muted)]">
        Et par billeder af opgaven gør tilbuddet hurtigere og mere præcist — men det haster ikke.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          void upload(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state === "sending"}
        className="mt-3 rounded-md border border-[color:var(--color-line-strong)] px-5 py-3 text-sm font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-blue)] hover:text-[color:var(--color-blue)] disabled:opacity-50"
      >
        {state === "sending" ? "Sender billeder…" : "Vælg billeder"}
      </button>
      {state === "error" ? (
        <p className="mt-2 text-xs text-red-600">Billederne kunne ikke sendes. Prøv igen.</p>
      ) : null}
    </div>
  );
}

/* --------------------------------- shared -------------------------------- */

function Chip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-colors " +
        (active
          ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.06] text-[color:var(--color-blue)]"
          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-blue)]")
      }
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {label}
    </button>
  );
}

function AudienceToggle({
  audience,
  onChange,
}: {
  audience: Audience;
  onChange: (a: Audience) => void;
}) {
  return (
    <div role="tablist" aria-label="Vælg kundetype" className="flex w-full max-w-[240px] rounded-full bg-[color:var(--color-line)]/40 p-1">
      {(["privat", "erhverv"] as const).map((a) => (
        <button
          key={a}
          type="button"
          role="tab"
          aria-selected={audience === a}
          onClick={() => onChange(a)}
          className={
            "flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200 " +
            (audience === a
              ? "bg-white text-[color:var(--color-ink)] shadow-sm"
              : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]")
          }
        >
          {a === "privat" ? "Privat" : "Erhverv"}
        </button>
      ))}
    </div>
  );
}

function TextField({
  label,
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
      <span className="text-sm font-medium text-[color:var(--color-ink)]">{label}</span>
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

/* -------------------------------- payload -------------------------------- */

function composeMessage(s: {
  audience: Audience;
  company: string;
  message: string;
  callTime: CallTime;
}): string {
  const lines = [
    `Kundetype: ${s.audience === "erhverv" ? "Erhverv" : "Privat"}`,
    `Vil ringes op: ${CALL_TIME_TEXT[s.callTime]}`,
  ];
  if (s.audience === "erhverv" && s.company.trim()) lines.push(`Virksomhed: ${s.company.trim()}`);
  const body = s.message.trim();
  return body ? `${lines.join("\n")}\n\n${body}` : lines.join("\n");
}

function serviceForDraft(audience: Audience, service: string): string {
  if (!service) return "";
  return `${audience === "erhverv" ? "Erhverv" : "Privat"} · ${service}`;
}
