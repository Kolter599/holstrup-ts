"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      city: String(data.get("city") || ""),
      service: String(data.get("service") || ""),
      message: String(data.get("message") || ""),
      company: String(data.get("company") || ""),
    };

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    } catch {
      setStatus("error");
      setMessage("Kunne ikke sende. Tjek din forbindelse, eller ring direkte.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
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
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="E-mail" name="email" required type="email" autoComplete="email" inputMode="email" />
        <Field label="By" name="city" placeholder="Fx Hillerød" autoComplete="address-level2" />
      </div>
      <Field label="Hvilken opgave?" name="service" placeholder="Fx nyt tag, tilbygning, byggerådgivning" />
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[color:var(--color-ink)]">Beskriv opgaven</span>
        <textarea
          name="message"
          rows={6}
          required
          className="rounded-md border border-[color:var(--color-line)] bg-white p-4 text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-blue)] text-base"
          placeholder="Hvad skal laves, hvor og hvornår? Et par linjer er rigeligt."
        />
      </label>
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
