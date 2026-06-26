"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Status = "idle" | "sending" | "sent" | "error";
type Attachment = { file: File; preview: string };
type Step = "service" | "contact" | "details" | "done";
type Audience = "privat" | "erhverv";

type ServiceTile = { value: string; label: string; subtitle: string; icon: ReactNode };

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;
const SESSION_KEY = "holstrup_visitor_id";

// Flow: service (hvad) → contact (oplysninger) → details (beskriv opgaven)
const STEP_ORDER: Step[] = ["service", "contact", "details"];

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

/* ---------------------- Inline line icons — clean, brand-neutral ---------------------- */
const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconRoof = () => (
  <svg {...iconProps}>
    <path d="M3 12 12 4l9 8" />
    <path d="M5 11v9h14v-9" />
    <path d="M9 20v-5h6v5" />
  </svg>
);

const IconExtension = () => (
  <svg {...iconProps}>
    <path d="M3 21V9l6-4 6 4v12" />
    <path d="M15 21v-7h6v7" />
    <path d="M3 21h18" />
    <path d="M9 21v-4h0" />
  </svg>
);

const IconRenovate = () => (
  <svg {...iconProps}>
    <path d="m14.5 4 5.5 5.5-9 9L3 21l2.5-8L14.5 4Z" />
    <path d="m12.5 6 5.5 5.5" />
  </svg>
);

const IconDoor = () => (
  <svg {...iconProps}>
    <path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" />
    <path d="M3 21h18" />
    <circle cx="15" cy="13" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconPlank = () => (
  <svg {...iconProps}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
    <path d="M7 7v10" />
    <path d="M13 7v10" />
    <path d="M18 7v10" />
  </svg>
);

const IconSparkle = () => (
  <svg {...iconProps}>
    <path d="M12 4v4" />
    <path d="M12 16v4" />
    <path d="M4 12h4" />
    <path d="M16 12h4" />
    <path d="m6.3 6.3 2.8 2.8" />
    <path d="m14.9 14.9 2.8 2.8" />
    <path d="m17.7 6.3-2.8 2.8" />
    <path d="m9.1 14.9-2.8 2.8" />
  </svg>
);

const IconBuilding = () => (
  <svg {...iconProps}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M8 7h1.5" />
    <path d="M14.5 7H16" />
    <path d="M8 11h1.5" />
    <path d="M14.5 11H16" />
    <path d="M8 15h1.5" />
    <path d="M14.5 15H16" />
    <path d="M10 21v-4h4v4" />
  </svg>
);

const IconBlueprint = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M3 9h18" />
    <path d="M9 9v11" />
    <path d="M9 14h6" />
    <path d="M15 14v6" />
  </svg>
);

const IconHardhat = () => (
  <svg {...iconProps}>
    <path d="M4 17h16" />
    <path d="M5 17v-2a7 7 0 0 1 14 0v2" />
    <path d="M10 8V5h4v3" />
  </svg>
);

const SERVICE_TILES_PRIVAT: ServiceTile[] = [
  { value: "Nyt tag", label: "Nyt tag", subtitle: "Tagrenovering, omlægning", icon: <IconRoof /> },
  { value: "Tilbygning / udestue", label: "Tilbygning", subtitle: "Tilbygning, udestue, garage", icon: <IconExtension /> },
  { value: "Renovering", label: "Renovering", subtitle: "Helhed eller delopgaver", icon: <IconRenovate /> },
  { value: "Vinduer & døre", label: "Vinduer & døre", subtitle: "Udskiftning, montage", icon: <IconDoor /> },
  { value: "Træværk & gulve", label: "Træværk & gulve", subtitle: "Gulve, terrasse, lister", icon: <IconPlank /> },
  { value: "Andet", label: "Noget andet", subtitle: "Beskriv det i næste skridt", icon: <IconSparkle /> },
];

const SERVICE_TILES_ERHVERV: ServiceTile[] = [
  { value: "Erhvervsbyggeri", label: "Erhvervsbyggeri", subtitle: "Nybyggeri, kontor, butik", icon: <IconBuilding /> },
  { value: "Totalentreprise", label: "Totalentreprise", subtitle: "Vi styrer hele projektet", icon: <IconBlueprint /> },
  { value: "Tag- og facadeentreprise", label: "Tag & facade", subtitle: "Erhvervstag, facadearbejde", icon: <IconRoof /> },
  { value: "Renovering / ombygning", label: "Renovering", subtitle: "Ombygning af bestående", icon: <IconRenovate /> },
  { value: "Vedligehold & service", label: "Vedligehold", subtitle: "Løbende service-aftaler", icon: <IconHardhat /> },
  { value: "Andet", label: "Noget andet", subtitle: "Beskriv det i næste skridt", icon: <IconSparkle /> },
];

export function ContactForm() {
  const [audience, setAudience] = useState<Audience>("privat");
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [photos, setPhotos] = useState<Attachment[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const sessionIdRef = useRef<string>("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Latest field snapshot for the leave-the-page beacon (avoids stale closures).
  const snapshotRef = useRef({
    audience,
    service,
    message,
    name,
    phone,
    email,
    city,
    company,
    status,
  });
  snapshotRef.current = { audience, service, message, name, phone, email, city, company, status };
  const partialSentRef = useRef(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // If the visitor gave name + phone but leaves before pressing Send, fire a
  // one-shot beacon so Finn still gets the warm lead. Server dedupes per session.
  useEffect(() => {
    function notifyIfAbandoned() {
      if (partialSentRef.current) return;
      const s = snapshotRef.current;
      if (s.status === "sent" || s.status === "sending") return;
      if (s.name.trim().length < 2 || s.phone.trim().length < 6) return;
      if (!sessionIdRef.current || typeof navigator === "undefined" || !navigator.sendBeacon)
        return;
      partialSentRef.current = true;
      const payload = JSON.stringify({
        sessionId: sessionIdRef.current,
        name: s.name,
        email: s.email,
        phone: s.phone,
        city: s.city,
        service: serviceForDraft(s.audience, s.service),
        message: composeMessage(s.audience, s.company, s.message),
      });
      navigator.sendBeacon(
        "/api/contact-partial",
        new Blob([payload], { type: "application/json" }),
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
  }, []);

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (!service && !message && !name && !phone && !email && !city && !company)
      return;
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
          message: composeMessage(audience, company, message),
        }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [audience, service, message, name, phone, email, city, company]);

  function selectAudience(next: Audience) {
    if (next === audience) return;
    setAudience(next);
    setService("");
  }

  function selectService(value: string) {
    setService(value);
    setTimeout(() => setStep("contact"), 180);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setPhotoError(null);
    const next: Attachment[] = [...photos];
    for (const file of Array.from(fileList)) {
      if (next.length >= MAX_PHOTOS) {
        setPhotoError(`Max ${MAX_PHOTOS} billeder ad gangen.`);
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

  function removePhoto(idx: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  }

  async function submit() {
    if (status === "sending") return;
    setStatus("sending");
    setServerMessage("");

    const out = new FormData();
    out.set("name", name.trim());
    out.set("email", email.trim());
    out.set("phone", phone.trim());
    out.set("city", city.trim());
    out.set("service", serviceForDraft(audience, service));
    out.set("message", composeMessage(audience, company, message));
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
      setStatus("sent");
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos([]);
      setStep("done");
    } catch {
      setStatus("error");
      setServerMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  const stageIndex = step === "done" ? STEP_ORDER.length : STEP_ORDER.indexOf(step);
  const progress = step === "done" ? 100 : ((stageIndex + 1) / STEP_ORDER.length) * 100;

  const serviceTiles = audience === "erhverv" ? SERVICE_TILES_ERHVERV : SERVICE_TILES_PRIVAT;

  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
      <div className="border-b border-[color:var(--color-line)] bg-white px-6 py-5 md:px-8 md:py-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="eyebrow-accent">Gratis tilbud</div>
          {step !== "done" ? (
            <span className="font-mono text-xs text-[color:var(--color-muted)]">
              {Math.min(stageIndex + 1, STEP_ORDER.length)}/{STEP_ORDER.length}
            </span>
          ) : null}
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--color-line)]/60">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: "var(--color-blue)" }}
          />
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {step === "service" && (
          <StepService
            audience={audience}
            onAudienceChange={selectAudience}
            tiles={serviceTiles}
            selected={service}
            onSelect={selectService}
          />
        )}
        {step === "contact" && (
          <StepContact
            audience={audience}
            name={name}
            phone={phone}
            email={email}
            city={city}
            company={company}
            setName={setName}
            setPhone={setPhone}
            setEmail={setEmail}
            setCity={setCity}
            setCompany={setCompany}
            onBack={() => setStep("service")}
            onNext={() => setStep("details")}
          />
        )}
        {step === "details" && (
          <StepDetails
            service={service}
            message={message}
            setMessage={setMessage}
            photos={photos}
            photoError={photoError}
            fileInputRef={fileInputRef}
            onAddFiles={addFiles}
            onRemovePhoto={removePhoto}
            status={status}
            serverMessage={serverMessage}
            onBack={() => setStep("contact")}
            onSubmit={submit}
          />
        )}
        {step === "done" && <StepDone name={name} />}
      </div>
    </div>
  );
}

function composeMessage(
  audience: Audience,
  company: string,
  message: string
): string {
  const lines: string[] = [];
  lines.push(`Kundetype: ${audience === "erhverv" ? "Erhverv" : "Privat"}`);
  if (audience === "erhverv" && company.trim()) lines.push(`Virksomhed: ${company.trim()}`);
  const meta = lines.join("\n");
  const body = message.trim();
  return body ? `${meta}\n\n${body}` : meta;
}

function serviceForDraft(audience: Audience, service: string): string {
  if (!service) return "";
  return `${audience === "erhverv" ? "Erhverv" : "Privat"} · ${service}`;
}

/* ---------------------- Step 1: Audience + Service ---------------------- */
function StepService({
  audience,
  onAudienceChange,
  tiles,
  selected,
  onSelect,
}: {
  audience: Audience;
  onAudienceChange: (a: Audience) => void;
  tiles: ServiceTile[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
          Hvad kan vi hjælpe med?
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-soft)]">
          Vælg det der ligger tættest — vi spørger ind til detaljerne bagefter.
        </p>
      </div>

      <AudienceToggle audience={audience} onChange={onAudienceChange} />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {tiles.map((t) => {
          const isActive = selected === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onSelect(t.value)}
              className={
                "group flex items-start gap-3.5 rounded-md border-2 bg-white p-4 text-left transition-all duration-200 hover:border-[color:var(--color-blue)] hover:bg-[color:var(--color-blue)]/[0.03] " +
                (isActive
                  ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.05] shadow-sm"
                  : "border-[color:var(--color-line)]")
              }
            >
              <span
                className={
                  "mt-0.5 shrink-0 transition-colors " +
                  (isActive ? "text-[color:var(--color-blue)]" : "text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-blue)]")
                }
              >
                {t.icon}
              </span>
              <span className="flex-1">
                <span className="block font-display text-base font-bold leading-tight text-[color:var(--color-ink)]">
                  {t.label}
                </span>
                <span className="mt-1 block text-xs text-[color:var(--color-ink-soft)]">
                  {t.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
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
    <div
      role="tablist"
      aria-label="Vælg kundetype"
      className="mx-auto flex w-full max-w-[280px] rounded-full bg-[color:var(--color-line)]/40 p-1"
    >
      {(["privat", "erhverv"] as const).map((a) => {
        const isActive = audience === a;
        return (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(a)}
            className={
              "flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200 " +
              (isActive
                ? "bg-white text-[color:var(--color-ink)] shadow-sm"
                : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]")
            }
          >
            {a === "privat" ? "Privat" : "Erhverv"}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------- Step 3: Details + Photos (final — submits) ---------------------- */
function StepDetails({
  service,
  message,
  setMessage,
  photos,
  photoError,
  fileInputRef,
  onAddFiles,
  onRemovePhoto,
  status,
  serverMessage,
  onBack,
  onSubmit,
}: {
  service: string;
  message: string;
  setMessage: (v: string) => void;
  photos: Attachment[];
  photoError: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAddFiles: (files: FileList | null) => void;
  onRemovePhoto: (i: number) => void;
  status: Status;
  serverMessage: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = message.trim().length >= 5 && status !== "sending";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
          Beskriv kort opgaven
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-soft)]">
          Et par linjer er rigeligt. Billeder hjælper os med at give et hurtigere tilbud.
        </p>
        {service ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-blue)]/[0.08] px-3 py-1 text-xs font-medium text-[color:var(--color-blue)]">
            <span>{service}</span>
          </div>
        ) : null}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">Hvad skal laves?</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
          placeholder="Fx 'Nyt tag på 110 m² hus — eternit der trænger til udskiftning.'"
        />
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">
          Billeder af opgaven{" "}
          <span className="font-normal text-[color:var(--color-muted)]">(valgfrit)</span>
        </span>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onAddFiles(e.dataTransfer.files);
          }}
          className="rounded-md border-2 border-dashed border-[color:var(--color-line)] bg-white/50 p-5 text-center transition-colors hover:border-[color:var(--color-blue)]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) => {
              onAddFiles(e.target.files);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-medium text-[color:var(--color-blue)] hover:underline"
          >
            Vælg billeder fra telefon eller computer
          </button>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Op til {MAX_PHOTOS} billeder · træk og slip virker også
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
                  onClick={() => onRemovePhoto(i)}
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

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="h-[60px] rounded-md border border-[color:var(--color-line)] px-5 text-sm font-medium text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink-soft)]"
        >
          Tilbage
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="h-[60px] flex-1 rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sender…" : "Send til Finn →"}
        </button>
      </div>

      <p className="text-center text-xs text-[color:var(--color-muted)]">
        Vi videregiver ikke dine oplysninger. Finn vender personligt tilbage.
      </p>

      {status === "error" && serverMessage ? (
        <p className="text-sm text-red-600">{serverMessage}</p>
      ) : null}
    </div>
  );
}

/* ---------------------- Step 2: Contact info ---------------------- */
function StepContact({
  audience,
  name,
  phone,
  email,
  city,
  company,
  setName,
  setPhone,
  setEmail,
  setCity,
  setCompany,
  onBack,
  onNext,
}: {
  audience: Audience;
  name: string;
  phone: string;
  email: string;
  city: string;
  company: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setCity: (v: string) => void;
  setCompany: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const isErhverv = audience === "erhverv";
  const companyValid = !isErhverv || company.trim().length >= 2;
  const canContinue =
    name.trim().length >= 2 && phone.trim().length >= 6 && companyValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue) return;
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
          Hvem skal Finn ringe til?
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--color-ink-soft)]">
          Vi ringer typisk samme dag — du forpligter dig til intet.
        </p>
      </div>

      {isErhverv ? (
        <Field
          label="Virksomhed"
          required
          value={company}
          onChange={setCompany}
          autoComplete="organization"
          placeholder="Firma A/S"
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Dit navn"
          required
          value={name}
          onChange={setName}
          autoComplete="name"
          placeholder="Fornavn Efternavn"
        />
        <Field
          label="Telefon"
          required
          value={phone}
          onChange={setPhone}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+45 …"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="(valgfrit)"
        />
        <Field
          label="By"
          value={city}
          onChange={setCity}
          autoComplete="address-level2"
          placeholder="Fx Hillerød — valgfrit"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="h-[60px] rounded-md border border-[color:var(--color-line)] px-5 text-sm font-medium text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink-soft)]"
        >
          Tilbage
        </button>
        <button
          type="submit"
          disabled={!canContinue}
          className="h-[60px] flex-1 rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Fortsæt →
        </button>
      </div>
    </form>
  );
}

/* ---------------------- Step 4: Done ---------------------- */
function StepDone({ name }: { name: string }) {
  const firstName = name.trim().split(" ")[0] || "";
  return (
    <div className="space-y-4 py-6 text-center">
      <div
        className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: "var(--color-blue)" }}
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-[1.9rem]">
        Tak{firstName ? `, ${firstName}` : ""} — vi er på det
      </h2>
      <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-soft)]">
        Finn har modtaget din besked og vender personligt tilbage — typisk samme dag.
      </p>
    </div>
  );
}

/* ---------------------- Shared ---------------------- */
type FieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text" | "url" | "search" | "none" | "numeric" | "decimal";
};

function Field({
  label,
  required,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--color-ink)]">
        {label}
        {required && <span className="text-[color:var(--color-muted)]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
      />
    </label>
  );
}
