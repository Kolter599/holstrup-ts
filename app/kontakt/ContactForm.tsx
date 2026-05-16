"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";
type Attachment = { file: File; preview: string };
type Step = "service" | "timing" | "details" | "contact" | "done";

type ServiceTile = { value: string; label: string; subtitle: string; icon: string };
type TimingTile = { value: string; label: string; subtitle: string };

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;
const SESSION_KEY = "holstrup_visitor_id";

const SERVICE_TILES: ServiceTile[] = [
  { value: "Nyt tag", label: "Nyt tag", subtitle: "Tagrenovering, omlægning, tagdækning", icon: "🏠" },
  { value: "Tilbygning / udestue", label: "Tilbygning", subtitle: "Tilbygning, udestue, garage", icon: "🧱" },
  { value: "Renovering", label: "Renovering", subtitle: "Helheds-renovering eller delopgaver", icon: "🔨" },
  { value: "Vinduer & døre", label: "Vinduer & døre", subtitle: "Udskiftning, montage, lister", icon: "🚪" },
  { value: "Træværk & gulve", label: "Træværk & gulve", subtitle: "Trægulve, terrasse, lister", icon: "🪵" },
  { value: "Andet", label: "Noget andet", subtitle: "Beskriv det i næste skridt", icon: "✱" },
];

const TIMING_TILES: TimingTile[] = [
  { value: "Hurtigst muligt", label: "Hurtigst muligt", subtitle: "Inden for nogle uger" },
  { value: "Inden 3 måneder", label: "Inden 3 måneder", subtitle: "Vi planlægger fremad" },
  { value: "Senere på året", label: "Senere på året", subtitle: "Vi har god tid" },
  { value: "Bare et tilbud først", label: "Først et tilbud", subtitle: "Vi vil se økonomien" },
];

const STEP_ORDER: Step[] = ["service", "timing", "details", "contact"];

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

export function ContactForm() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<string>("");
  const [timing, setTiming] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [photos, setPhotos] = useState<Attachment[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const sessionIdRef = useRef<string>("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whatever's typed in to /api/contact-draft so admin sees them
  // even if they bail before submitting. Debounced 600ms.
  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (!service && !timing && !message && !name && !phone && !email && !city) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      const composedMessage = composeMessage(timing, message);
      void fetch("/api/contact-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name,
          email,
          phone,
          city,
          service,
          message: composedMessage,
        }),
        keepalive: true,
      }).catch(() => {
        /* best-effort */
      });
    }, 600);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [service, timing, message, name, phone, email, city]);

  function scrollCardIntoView() {
    if (typeof window === "undefined") return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(next: Step) {
    setStep(next);
    setTimeout(scrollCardIntoView, 60);
  }

  function selectService(value: string) {
    setService(value);
    setTimeout(() => goTo("timing"), 180);
  }

  function selectTiming(value: string) {
    setTiming(value);
    setTimeout(() => goTo("details"), 180);
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
    out.set("service", service);
    out.set("message", composeMessage(timing, message));
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
      goTo("done");
    } catch {
      setStatus("error");
      setServerMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  const stageIndex = step === "done" ? STEP_ORDER.length : STEP_ORDER.indexOf(step);
  const progress = step === "done" ? 100 : ((stageIndex + 1) / STEP_ORDER.length) * 100;

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)]"
    >
      {/* Header with progress */}
      <div className="border-b border-[color:var(--color-line)] bg-white px-5 py-4 md:px-7 md:py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="eyebrow-accent">Få et gratis tilbud</div>
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

      <div className="px-5 py-6 md:px-7 md:py-8">
        {step === "service" && (
          <StepService
            tiles={SERVICE_TILES}
            selected={service}
            onSelect={selectService}
          />
        )}
        {step === "timing" && (
          <StepTiming
            tiles={TIMING_TILES}
            selected={timing}
            onSelect={selectTiming}
            onBack={() => goTo("service")}
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
            onBack={() => goTo("timing")}
            onNext={() => goTo("contact")}
          />
        )}
        {step === "contact" && (
          <StepContact
            name={name}
            phone={phone}
            email={email}
            city={city}
            setName={setName}
            setPhone={setPhone}
            setEmail={setEmail}
            setCity={setCity}
            status={status}
            serverMessage={serverMessage}
            onBack={() => goTo("details")}
            onSubmit={submit}
          />
        )}
        {step === "done" && <StepDone name={name} />}
      </div>
    </div>
  );
}

function composeMessage(timing: string, message: string): string {
  const prefix = timing ? `Tidsramme: ${timing}\n\n` : "";
  return `${prefix}${message}`.trim();
}

/* ---------------------- Step 1: Service ---------------------- */
function StepService({
  tiles,
  selected,
  onSelect,
}: {
  tiles: ServiceTile[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
          Hvad kan vi hjælpe med?
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)] md:text-base">
          Vælg det der ligger tættest — vi spørger ind til detaljerne bagefter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {tiles.map((t) => {
          const isActive = selected === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onSelect(t.value)}
              className={
                "group flex items-start gap-3 rounded-md border-2 bg-white p-4 text-left transition-all duration-200 hover:border-[color:var(--color-blue)] hover:bg-[color:var(--color-blue)]/[0.03] " +
                (isActive
                  ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.05] shadow-sm"
                  : "border-[color:var(--color-line)]")
              }
            >
              <span className="text-2xl leading-none" aria-hidden>
                {t.icon}
              </span>
              <span className="flex-1">
                <span className="block font-display text-base font-bold text-[color:var(--color-ink)]">
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs text-[color:var(--color-ink-soft)]">
                  {t.subtitle}
                </span>
              </span>
              <span
                className={
                  "mt-0.5 text-[color:var(--color-muted)] transition-all duration-200 " +
                  (isActive ? "translate-x-0 text-[color:var(--color-blue)] opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")
                }
                aria-hidden
              >
                →
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-[color:var(--color-muted)]">
        Gratis og uforpligtende. Typisk svar samme dag.
      </p>
    </div>
  );
}

/* ---------------------- Step 2: Timing ---------------------- */
function StepTiming({
  tiles,
  selected,
  onSelect,
  onBack,
}: {
  tiles: TimingTile[];
  selected: string;
  onSelect: (v: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
          Hvornår skal det laves?
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)] md:text-base">
          Bare så Finn ved hvor meget planlægning der er — du forpligter dig til intet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {tiles.map((t) => {
          const isActive = selected === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onSelect(t.value)}
              className={
                "rounded-md border-2 bg-white p-4 text-left transition-all duration-200 hover:border-[color:var(--color-blue)] hover:bg-[color:var(--color-blue)]/[0.03] " +
                (isActive
                  ? "border-[color:var(--color-blue)] bg-[color:var(--color-blue)]/[0.05] shadow-sm"
                  : "border-[color:var(--color-line)]")
              }
            >
              <span className="block font-display text-base font-bold text-[color:var(--color-ink)]">
                {t.label}
              </span>
              <span className="mt-0.5 block text-xs text-[color:var(--color-ink-soft)]">
                {t.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <BackButton onBack={onBack} />
    </div>
  );
}

/* ---------------------- Step 3: Details + Photos ---------------------- */
function StepDetails({
  service,
  message,
  setMessage,
  photos,
  photoError,
  fileInputRef,
  onAddFiles,
  onRemovePhoto,
  onBack,
  onNext,
}: {
  service: string;
  message: string;
  setMessage: (v: string) => void;
  photos: Attachment[];
  photoError: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAddFiles: (files: FileList | null) => void;
  onRemovePhoto: (i: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canContinue = message.trim().length >= 5;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
          Beskriv kort opgaven
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)] md:text-base">
          Et par linjer er rigeligt. Billeder hjælper Finn med at give et hurtigere tilbud.
        </p>
        {service ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-blue)]/[0.08] px-3 py-1 text-xs font-medium text-[color:var(--color-blue)]">
            <span>{service}</span>
          </div>
        ) : null}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">
          Hvad skal laves?
        </span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-base text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)]"
          placeholder="Fx 'Nyt tag på 110 m² hus i Hillerød — eternit der trænger til udskiftning.'"
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
          className="rounded-md border-2 border-dashed border-[color:var(--color-line)] bg-white/50 p-4 text-center transition-colors hover:border-[color:var(--color-blue)]"
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
          className="h-[52px] rounded-md border border-[color:var(--color-line)] px-5 text-sm font-medium text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink-soft)]"
        >
          Tilbage
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 h-[52px] rounded-md bg-[color:var(--color-blue)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Fortsæt →
        </button>
      </div>
    </div>
  );
}

/* ---------------------- Step 4: Contact info ---------------------- */
function StepContact({
  name,
  phone,
  email,
  city,
  setName,
  setPhone,
  setEmail,
  setCity,
  status,
  serverMessage,
  onBack,
  onSubmit,
}: {
  name: string;
  phone: string;
  email: string;
  city: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setCity: (v: string) => void;
  status: Status;
  serverMessage: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const canSubmit =
    name.trim().length >= 2 && phone.trim().length >= 6 && status !== "sending";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
          Hvem skal Finn ringe til?
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)] md:text-base">
          Vi ringer typisk samme dag — du forpligter dig til intet.
        </p>
      </div>

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
          className="h-[58px] rounded-md border border-[color:var(--color-line)] px-5 text-sm font-medium text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink-soft)]"
        >
          Tilbage
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 h-[58px] rounded-md bg-[color:var(--color-blue)] px-5 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
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
    </form>
  );
}

/* ---------------------- Step 5: Done ---------------------- */
function StepDone({ name }: { name: string }) {
  const firstName = name.trim().split(" ")[0] || "";
  return (
    <div className="space-y-4 py-4 text-center">
      <div
        className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: "var(--color-blue)" }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
        Tak{firstName ? `, ${firstName}` : ""} — vi er på det
      </h2>
      <p className="mx-auto max-w-sm text-sm text-[color:var(--color-ink-soft)] md:text-base">
        Finn har modtaget din besked og vender personligt tilbage — typisk samme dag.
      </p>
    </div>
  );
}

/* ---------------------- Shared ---------------------- */
function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="text-sm text-[color:var(--color-muted)] underline-offset-2 hover:text-[color:var(--color-ink-soft)] hover:underline"
    >
      ← Tilbage
    </button>
  );
}

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
