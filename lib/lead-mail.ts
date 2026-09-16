import { Resend } from "resend";

// One place that knows how a lead mail looks and how it gets sent. Every
// caller (submit, abandoned draft, cron retry, daily reminder) goes through
// sendLeadMail so a failure is always reported back as a string instead of
// disappearing into a console.error.

// Same Resend account as Invisu. We can only verify one domain on the free
// account (invisu.dk), so the From-address is `info@invisu.dk` even for
// Holstrup mails. Subject + body make it clear the mail belongs to
// holstrup-ts.dk.
const FROM_DEFAULT = "Holstrup TS via Invisu <info@invisu.dk>";

// Leads go to Finn, with the bureau in copy on every single one. Note for
// quota: Resend counts each To/CC recipient separately, so one lead mail is
// two against the plan.
const TO_DEFAULT = "finn@holstrup-ts.dk";
const CC_DEFAULT = "sebastian@invisu.dk";
const FORWARD_DEFAULT = TO_DEFAULT;

export const NUDGE = "Ring inden for 24 timer — det er der opgaverne vindes.";

export type MailAttachment = { filename: string; content: Buffer };

export type SendResult = { sent: boolean; error: string | null };

export type LeadMail = {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
  photoCount?: number;
};

export function mailFrom(): string {
  return process.env.RESEND_FROM ?? FROM_DEFAULT;
}

export function mailTo(): string {
  return process.env.CONTACT_TO_EMAIL ?? TO_DEFAULT;
}

/** The bureau, in copy on every lead mail. Empty value turns the copy off. */
export function mailCc(): string | undefined {
  const cc = process.env.CONTACT_CC_EMAIL ?? CC_DEFAULT;
  return cc.trim() ? cc : undefined;
}

/** Where "Videresend" in the admin sends a lead. */
export function forwardTo(): string {
  return process.env.FORWARD_TO_EMAIL ?? FORWARD_DEFAULT;
}

/**
 * Send and always return the outcome. Never throws — the caller is expected to
 * persist `error` so a silent failure becomes a visible one.
 */
export async function sendLeadMail(args: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Defaults to mailTo(); only the admin forward passes something else. */
  to?: string;
  /** Defaults to mailCc(); the admin forward passes null to send without copy. */
  cc?: string | null;
  attachments?: MailAttachment[];
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY mangler — mailen blev aldrig forsøgt sendt." };
  }
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: mailFrom(),
      to: args.to ?? mailTo(),
      cc: args.cc === null ? undefined : (args.cc ?? mailCc()),
      replyTo: args.replyTo || undefined,
      subject: args.subject,
      html: args.html,
      text: args.text,
      attachments: args.attachments,
    });
    if ("error" in result && result.error) {
      return { sent: false, error: JSON.stringify(result.error).slice(0, 1000) };
    }
    return { sent: true, error: null };
  } catch (e) {
    return { sent: false, error: ((e as Error)?.message ?? String(e)).slice(0, 1000) };
  }
}

/* ------------------------------- subjects ------------------------------- */

function what(f: LeadMail): string {
  const parts = [f.service || "Ny opgave", f.city ? `i ${f.city}` : null].filter(Boolean);
  return parts.join(" ");
}

export function submitSubject(f: LeadMail): string {
  const who = f.name || f.phone || "ukendt";
  const photos = f.photoCount ? ` · ${f.photoCount} billede${f.photoCount === 1 ? "" : "r"}` : "";
  return `Ny henvendelse: ${what(f)} — ${who}${photos}`;
}

export function partialSubject(f: LeadMail): string {
  const who = f.name || f.phone || "ukendt";
  return `⚠️ Ikke afsendt: ${what(f)} — ${who}`;
}

/* --------------------------------- bodies -------------------------------- */

type Variant = "submit" | "partial";

const COPY: Record<Variant, { title: string; intro: (name: string) => string }> = {
  submit: {
    title: "Du har fået en ny opgave fra hjemmesiden",
    intro: (name) =>
      `Hej Finn — ${name || "en besøgende"} har sendt en henvendelse via holstrup-ts.dk.`,
  },
  partial: {
    title: "Nogen begyndte en henvendelse — men nåede ikke at sende",
    intro: (name) =>
      `Hej Finn — ${name || "en besøgende"} har lagt sine kontaktoplysninger på holstrup-ts.dk uden at trykke "Send". Det er et varmt lead.`,
  },
};

export function buildLeadHtml(variant: Variant, f: LeadMail): string {
  const copy = COPY[variant];
  return shell(
    copy.title,
    `${escapeHtml(copy.intro(f.name))} <strong>${escapeHtml(NUDGE)}</strong>`,
    [
      f.name ? row("Navn", escapeHtml(f.name)) : null,
      f.phone ? row("Telefon", link(`tel:${f.phone.replace(/\s/g, "")}`, f.phone)) : null,
      f.email ? row("E-mail", link(`mailto:${f.email}`, f.email)) : null,
      f.city ? row("By", escapeHtml(f.city)) : null,
      f.service ? row("Opgave", escapeHtml(f.service)) : null,
      f.photoCount ? row("Billeder", `${f.photoCount} vedhæftet — se i bunden af mailen`) : null,
    ],
    f.message
      ? `<div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557;margin-bottom:8px">Beskrivelse</div>
         <div style="font:400 16px/1.7 Inter,sans-serif;color:#262a2d;white-space:pre-wrap">${escapeHtml(f.message)}</div>`
      : `<div style="font:400 14px/1.55 Inter,sans-serif;color:#6e6557">(Ingen beskrivelse af opgaven — ring og spørg.)</div>`,
    f.email
      ? `Svarer du på denne mail, går svaret direkte til ${escapeHtml(f.name || f.email)}.`
      : `De har ikke oplyst e-mail — ring til dem i stedet.`,
  );
}

export function buildLeadText(variant: Variant, f: LeadMail): string {
  return [
    COPY[variant].title + " — holstrup-ts.dk",
    "",
    COPY[variant].intro(f.name),
    NUDGE,
    "",
    f.name ? `Navn:     ${f.name}` : null,
    f.phone ? `Telefon:  ${f.phone}` : null,
    f.email ? `E-mail:   ${f.email}` : null,
    f.city ? `By:       ${f.city}` : null,
    f.service ? `Opgave:   ${f.service}` : null,
    f.photoCount ? `Billeder: ${f.photoCount} vedhæftet` : null,
    "",
    f.message ? `Beskrivelse:\n${f.message}` : "(Ingen beskrivelse af opgaven — ring og spørg.)",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/* -------------------------------- reminder -------------------------------- */

export type ReminderLead = LeadMail & { createdAt: Date; adminUrl: string };

export function reminderSubject(leads: ReminderLead[]): string {
  return leads.length === 1
    ? `Husk at ringe: ${leads[0].name || leads[0].phone}`
    : `${leads.length} henvendelser venter stadig på svar`;
}

export function buildReminderHtml(leads: ReminderLead[]): string {
  const items = leads.map((l) => {
    const days = Math.max(1, Math.round((Date.now() - l.createdAt.getTime()) / 86_400_000));
    return row(
      `${days} dag${days === 1 ? "" : "e"} siden · ${escapeHtml(l.service || "Opgave")}${l.city ? ` · ${escapeHtml(l.city)}` : ""}`,
      `${escapeHtml(l.name || "(uden navn)")} — ${l.phone ? link(`tel:${l.phone.replace(/\s/g, "")}`, l.phone) : "(intet telefonnummer)"}${
        l.email ? ` · ${link(`mailto:${l.email}`, l.email)}` : ""
      }`,
    );
  });
  return shell(
    leads.length === 1 ? "Der ligger stadig en henvendelse og venter" : `Der ligger ${leads.length} henvendelser og venter`,
    `Hej Finn — disse har stået som "ny" i mere end et døgn. <strong>${escapeHtml(NUDGE)}</strong>`,
    items,
    `<a href="${escapeHtml(leads[0]?.adminUrl ?? "")}" style="color:#1347a6">Markér dem som kontaktet i oversigten →</a>`,
    "Du får kun denne mail, så længe der ligger ubehandlede henvendelser.",
  );
}

export function buildReminderText(leads: ReminderLead[]): string {
  return [
    `Ubehandlede henvendelser på holstrup-ts.dk: ${leads.length}`,
    NUDGE,
    "",
    ...leads.map((l) =>
      `- ${l.name || "(uden navn)"} · ${l.phone || "(intet nummer)"}${l.email ? ` · ${l.email}` : ""}${l.city ? ` · ${l.city}` : ""}${l.service ? ` · ${l.service}` : ""}`,
    ),
    "",
    `Oversigt: ${leads[0]?.adminUrl ?? ""}`,
  ].join("\n");
}

/* --------------------------------- shell --------------------------------- */

function shell(
  title: string,
  intro: string,
  rows: Array<string | null>,
  body: string,
  footer: string,
): string {
  return `<!doctype html>
<html lang="da">
  <body style="margin:0;padding:40px 16px;background:#f4eee2;font-family:Inter,system-ui,sans-serif;color:#141618">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#faf5ea;border:1px solid #dbd0b9">
      <tr>
        <td style="padding:32px 32px 8px 32px">
          <div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557">Holstrup TS · holstrup-ts.dk</div>
          <h1 style="margin:8px 0 0 0;font:400 27px/1.12 Georgia,serif;letter-spacing:-0.02em;color:#141618">${escapeHtml(title)}</h1>
          <p style="margin:14px 0 0 0;font:400 15.5px/1.55 Inter,sans-serif;color:#262a2d">${intro}</p>
        </td>
      </tr>
      ${rows
        .filter((r): r is string => Boolean(r))
        .map((r) => `<tr><td style="padding:12px 32px 0 32px">${r}</td></tr>`)
        .join("")}
      <tr><td style="padding:20px 32px 8px 32px">${body}</td></tr>
      <tr><td style="padding:8px 32px 32px 32px"><p style="margin:0;font:400 13.5px/1.55 Inter,sans-serif;color:#6e6557">${footer}</p></td></tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string): string {
  return `<div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557">${label}</div>
<div style="font:400 16px/1.5 Inter,sans-serif;color:#141618;margin-top:4px">${value}</div>`;
}

function link(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="color:#1347a6;text-decoration:none">${escapeHtml(label)}</a>`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
