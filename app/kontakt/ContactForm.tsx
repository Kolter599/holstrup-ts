"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";
type Attachment = { file: File; preview: string };

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_MB = 8;

const SESSION_KEY = "holstrup_visitor_id";

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
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [photos, setPhotos] = useState<Attachment[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const sessionIdRef = useRef<string>("");
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive disclosure: once the 3 core fields are filled in,
  // reveal optional email + city + photo upload. Stays revealed even
  // if the user deletes (avoids jarring re-hide).
  function checkReveal() {
    if (revealed || !formRef.current) return;
    const data = new FormData(formRef.current);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const msg = String(data.get("message") || "").trim();
    if (name.length >= 2 && phone.length >= 6 && msg.length >= 5) {
      setRevealed(true);
    }
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

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // Save partial form data on every keystroke (debounced ~600ms).
  // Even if user closes the tab without sending, Finn sees them in admin.
  function scheduleDraftSave() {
    if (!formRef.current) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      if (!formRef.current || !sessionIdRef.current) return;
      const data = new FormData(formRef.current);
      // Skip if everything is empty
      const fields = ["name", "email", "phone", "city", "service", "message"] as const;
      const hasAny = fields.some((f) => String(data.get(f) || "").trim());
      if (!hasAny) return;
      const payload = {
        sessionId: sessionIdRef.current,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        city: String(data.get("city") || ""),
        service: String(data.get("service") || ""),
        message: String(data.get("message") || ""),
      };
      try {
        void fetch("/api/contact-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch {
        /* best-effort */
      }
    }, 600);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    // Send as multipart so we can attach photos. The API accepts both
    // JSON and multipart — multipart wins when files are present.
    const out = new FormData();
    out.set("name", String(data.get("name") || ""));
    out.set("email", String(data.get("email") || ""));
    out.set("phone", String(data.get("phone") || ""));
    out.set("city", String(data.get("city") || ""));
    out.set("message", String(data.get("message") || ""));
    out.set("company", String(data.get("company") || ""));
    out.set("sessionId", sessionIdRef.current);
    photos.forEach((p, i) => out.append(`photo_${i}`, p.file, p.file.name));

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: out,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Noget gik galt. Prøv igen, eller ring direkte.");
        return;
      }
      setStatus("sent");
      setMessage("Tak — din besked er sendt. Finn vender tilbage hurtigst muligt.");
      form.reset();
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos([]);
    } catch {
      setStatus("error");
      setMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={() => {
        scheduleDraftSave();
        checkReveal();
      }}
      className="grid gap-5"
      noValidate
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Dit navn" name="name" required autoComplete="name" />
        <Field label="Telefon" name="phone" required type="tel" autoComplete="tel" inputMode="tel" />
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">
          Beskriv kort din opgave
        </span>
        <textarea
          name="message"
          rows={5}
          required
          className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] text-base"
          placeholder="Fx 'Nyt tag på 110 m² hus i Hillerød — gerne i løbet af foråret.' Et par linjer er rigeligt."
        />
      </label>

      {/* Progressive disclosure — optional fields appear after the 3 core ones are filled */}
      <div
        className={
          revealed
            ? "grid gap-5 opacity-100 max-h-[1200px] transition-all duration-500 ease-out"
            : "grid gap-5 opacity-0 max-h-0 overflow-hidden pointer-events-none transition-all duration-500 ease-out"
        }
        aria-hidden={!revealed}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="E-mail" name="email" type="email" autoComplete="email" inputMode="email" placeholder="(valgfrit)" />
          <Field label="By" name="city" placeholder="Fx Hillerød — valgfrit" autoComplete="address-level2" />
        </div>

        {/* Photo upload — feels optional, big drop zone */}
        <div className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">
          Billeder af opgaven{" "}
          <span className="text-[color:var(--color-muted)] font-normal">
            (valgfrit — gør det meget nemmere at give et hurtigt tilbud)
          </span>
        </span>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="rounded-md border-2 border-dashed border-[color:var(--color-line)] bg-white/50 p-5 text-center hover:border-[color:var(--color-blue)] transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) => {
              addFiles(e.target.files);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[color:var(--color-blue)] font-medium hover:underline"
          >
            Vælg billeder fra telefon eller computer
          </button>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Op til {MAX_PHOTOS} billeder · træk og slip virker også
          </p>
        </div>
        {photos.length > 0 ? (
          <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {photos.map((p, i) => (
              <li
                key={i}
                className="relative aspect-square overflow-hidden rounded-md border border-[color:var(--color-line)] bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.preview}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white text-xs hover:bg-black"
                  aria-label="Fjern billede"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
          {photoError ? (
            <p className="text-xs text-red-600">{photoError}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-accent disabled:opacity-60 w-full sm:w-auto justify-center"
        >
          {status === "sending" ? "Sender…" : "Send besked"}
        </button>
        <span className="text-sm text-[color:var(--color-muted)]">Typisk svar samme dag.</span>
      </div>
      {status === "sent" && (
        <p className="text-[color:var(--color-blue)] text-sm">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">{message}</p>
      )}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text" | "url" | "search" | "none" | "numeric" | "decimal";
};

function Field({ label, name, required, type = "text", placeholder, autoComplete, inputMode }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--color-ink)]">
        {label}
        {required && <span className="text-[color:var(--color-muted)]"> *</span>}
      </span>
      <input
        name={name}
        required={required}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] text-base"
      />
    </label>
  );
}
