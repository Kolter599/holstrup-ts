import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  service?: string;
  message?: string;
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same Resend account as Invisu. We can only verify one domain on the free
// account (invisu.dk), so the From-address is `info@invisu.dk` even for
// Holstrup mails. Subject + body make it crystal clear the message belongs to
// holstrup-ts.dk so Finn doesn't get confused.
const FROM_DEFAULT = "Holstrup TS via Invisu <info@invisu.dk>";
const TO_FINN = "finn@holstrup-ts.dk";

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  // Honeypot — bots fill `company`; real users never see it.
  if (body.company && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();
  const city = (body.city || "").trim();
  const service = (body.service || "").trim();

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Angiv venligst et navn." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "E-mail ser ikke rigtig ud." }, { status: 400 });
  }
  if (phone.length < 6 || phone.length > 40) {
    return NextResponse.json({ error: "Angiv venligst et telefonnummer." }, { status: 400 });
  }
  if (message.length < 5 || message.length > 4000) {
    return NextResponse.json({ error: "Beskriv kort hvad opgaven drejer sig om." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM ?? FROM_DEFAULT;
  const toAddress = process.env.CONTACT_TO_EMAIL ?? TO_FINN;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Kontaktformularen er ikke konfigureret. Ring eller skriv direkte." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const subject = `Ny opgave fra hjemmesiden — ${name}${city ? ` (${city})` : ""}`;
  const html = buildHtml({ name, email, phone, city, service, message });
  const text = buildText({ name, email, phone, city, service, message });

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject,
      html,
      text,
    });
    if ("error" in result && result.error) {
      console.error("[holstrup/contact] resend error", result.error);
      return NextResponse.json(
        { error: "Kunne ikke sende din besked lige nu. Ring venligst direkte." },
        { status: 502 },
      );
    }
  } catch (e) {
    console.error("[holstrup/contact] send threw", e);
    return NextResponse.json(
      { error: "Kunne ikke sende din besked lige nu. Ring venligst direkte." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

type Fields = {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
};

function buildHtml(f: Fields) {
  return `<!doctype html>
<html lang="da">
  <body style="margin:0;padding:40px 16px;background:#f4eee2;font-family:Inter,system-ui,sans-serif;color:#141618">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#faf5ea;border:1px solid #dbd0b9">
      <tr>
        <td style="padding:32px 32px 8px 32px">
          <div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557">Holstrup TS · holstrup-ts.dk</div>
          <h1 style="margin:8px 0 0 0;font:400 28px/1.1 Georgia,serif;letter-spacing:-0.02em;color:#141618">Du har fået en ny opgave fra hjemmesiden</h1>
          <p style="margin:14px 0 0 0;font:400 15.5px/1.55 Inter,sans-serif;color:#262a2d">Hej Finn — ${escape(f.name)} har skrevet en henvendelse via holstrup-ts.dk. Her er deres oplysninger og besked:</p>
        </td>
      </tr>
      <tr><td style="padding:16px 32px 8px 32px">${row("Navn", escape(f.name))}</td></tr>
      <tr><td style="padding:0 32px 8px 32px">${row("E-mail", `<a href="mailto:${escape(f.email)}" style="color:#1347a6">${escape(f.email)}</a>`)}</td></tr>
      <tr><td style="padding:0 32px 8px 32px">${row("Telefon", `<a href="tel:${escape(f.phone)}" style="color:#1347a6">${escape(f.phone)}</a>`)}</td></tr>
      ${f.city ? `<tr><td style="padding:0 32px 8px 32px">${row("By", escape(f.city))}</td></tr>` : ""}
      ${f.service ? `<tr><td style="padding:0 32px 8px 32px">${row("Ydelse", escape(f.service))}</td></tr>` : ""}
      <tr>
        <td style="padding:16px 32px 8px 32px">
          <div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557;margin-bottom:8px">Beskrivelse af opgaven</div>
          <div style="font:400 16px/1.7 Inter,sans-serif;color:#262a2d;white-space:pre-wrap">${escape(f.message)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 32px 32px">
          <p style="margin:0;font:400 13.5px/1.55 Inter,sans-serif;color:#6e6557">Hvis du svarer på denne mail, går svaret direkte tilbage til ${escape(f.name)}.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string) {
  return `<div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557">${label}</div>
<div style="font:400 16px/1.5 Inter,sans-serif;color:#141618;margin-top:4px">${value}</div>`;
}

function buildText(f: Fields) {
  return [
    `Du har fået en ny opgave fra hjemmesiden holstrup-ts.dk.`,
    ``,
    `Hej Finn — ${f.name} har skrevet til dig.`,
    ``,
    `Navn:     ${f.name}`,
    `E-mail:   ${f.email}`,
    `Telefon:  ${f.phone}`,
    f.city ? `By:       ${f.city}` : null,
    f.service ? `Ydelse:   ${f.service}` : null,
    ``,
    `Beskrivelse:`,
    f.message,
    ``,
    `Svar du på denne mail, går svaret direkte til ${f.name}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
