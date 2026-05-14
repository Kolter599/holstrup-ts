import { NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import { sql, hasDb } from "@/lib/db";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  service?: string;
  message?: string;
  company?: string;
  sessionId?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same Resend account as Invisu. We can only verify one domain on the free
// account (invisu.dk), so the From-address is `info@invisu.dk` even for
// Holstrup mails. Subject + body make it crystal clear the message belongs to
// holstrup-ts.dk so Finn doesn't get confused.
const FROM_DEFAULT = "Holstrup TS via Invisu <info@invisu.dk>";
const TO_FINN = "finn@holstrup-ts.dk";

type Attachment = { filename: string; content: Buffer; contentType: string };

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  let body: Payload = {};
  const attachments: Attachment[] = [];

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await req.formData();
      body = {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") ?? ""),
        service: String(form.get("service") ?? ""),
        message: String(form.get("message") ?? ""),
        company: String(form.get("company") ?? ""),
        sessionId: String(form.get("sessionId") ?? ""),
      };
      // Pull up to MAX_PHOTOS files keyed photo_0 … photo_N
      for (let i = 0; i < MAX_PHOTOS; i++) {
        const f = form.get(`photo_${i}`);
        if (f instanceof File && f.size > 0) {
          if (f.size > MAX_PHOTO_BYTES) continue;
          const buf = Buffer.from(await f.arrayBuffer());
          attachments.push({
            filename: f.name || `photo_${i}.jpg`,
            content: buf,
            contentType: f.type || "image/jpeg",
          });
        }
      }
    } catch {
      return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
    }
  } else {
    try {
      body = (await req.json()) as Payload;
    } catch {
      return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
    }
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

  // Required: name + phone + message. Email + city are optional now.
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Angiv venligst et navn." }, { status: 400 });
  }
  if (phone.length < 6 || phone.length > 40) {
    return NextResponse.json({ error: "Angiv venligst et telefonnummer." }, { status: 400 });
  }
  if (email && (!EMAIL_RE.test(email) || email.length > 200)) {
    return NextResponse.json({ error: "E-mail ser ikke rigtig ud." }, { status: 400 });
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

  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;
  const country =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;

  // Upload photos to Vercel Blob in parallel so admin can render thumbnails
  // later. Best-effort — if Blob token isn't set or upload fails, we still
  // attach the bytes to the email and skip persisting URLs.
  const photoUrls: string[] = [];
  if (attachments.length > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
    const folder = `holstrup-leads/${sessionId ?? "anon"}-${Date.now()}`;
    const uploads = attachments.map(async (a, i) => {
      try {
        const result = await put(`${folder}/${i}-${a.filename}`, a.content, {
          access: "public",
          contentType: a.contentType,
          addRandomSuffix: true,
        });
        return result.url;
      } catch (err) {
        console.error("[holstrup/contact] blob upload failed", err);
        return null;
      }
    });
    const urls = await Promise.all(uploads);
    for (const u of urls) {
      if (u) photoUrls.push(u);
    }
  }

  // Persist FIRST so the lead is captured even if email fails. Upsert by
  // session_id so submitted=true lands on the same row created during draft
  // typing (no duplicate "typed" + "sent" rows for the same visitor).
  let persisted = false;
  if (hasDb && sql) {
    try {
      const photoCount = attachments.length;
      const photoUrlsJson = photoUrls.length > 0 ? JSON.stringify(photoUrls) : null;
      if (sessionId) {
        await sql`
          INSERT INTO holstrup_leads (
            session_id, name, email, phone, city, service, message,
            user_agent, referrer, country, submitted, photo_count, photo_urls
          ) VALUES (
            ${sessionId}, ${name}, ${email}, ${phone},
            ${city || null}, ${service || null}, ${message},
            ${userAgent}, ${referrer}, ${country}, TRUE, ${photoCount},
            ${photoUrlsJson}::jsonb
          )
          ON CONFLICT (session_id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            city = COALESCE(EXCLUDED.city, holstrup_leads.city),
            service = COALESCE(EXCLUDED.service, holstrup_leads.service),
            message = EXCLUDED.message,
            submitted = TRUE,
            photo_count = GREATEST(holstrup_leads.photo_count, EXCLUDED.photo_count),
            photo_urls = COALESCE(EXCLUDED.photo_urls, holstrup_leads.photo_urls),
            updated_at = NOW();
        `;
      } else {
        await sql`
          INSERT INTO holstrup_leads (
            name, email, phone, city, service, message,
            user_agent, referrer, country, submitted, photo_count, photo_urls
          ) VALUES (
            ${name}, ${email}, ${phone}, ${city || null}, ${service || null},
            ${message}, ${userAgent}, ${referrer}, ${country}, TRUE, ${photoCount},
            ${photoUrlsJson}::jsonb
          )
        `;
      }
      persisted = true;
    } catch (e) {
      console.error("[holstrup/contact] db insert failed", e);
    }
  }

  const resend = new Resend(apiKey);
  const photoCount = attachments.length;
  const subject = `Ny opgave fra hjemmesiden — ${name}${city ? ` (${city})` : ""}${photoCount ? ` · ${photoCount} billede${photoCount === 1 ? "" : "r"}` : ""}`;
  const html = buildHtml({ name, email, phone, city, service, message, photoCount });
  const text = buildText({ name, email, phone, city, service, message, photoCount });

  let emailErr: string | null = null;
  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email || undefined,
      subject,
      html,
      text,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    if ("error" in result && result.error) {
      emailErr = JSON.stringify(result.error);
      console.error("[holstrup/contact] resend error", result.error);
    }
  } catch (e) {
    emailErr = (e as Error)?.message ?? String(e);
    console.error("[holstrup/contact] send threw", e);
  }

  // Update DB with email outcome so admin can see which holstrup_leads got their mail
  if (persisted && hasDb && sql) {
    try {
      await sql`
        UPDATE holstrup_leads
        SET email_sent = ${!emailErr}, email_error = ${emailErr}, updated_at = NOW()
        WHERE email = ${email} AND created_at > NOW() - INTERVAL '1 minute'
      `;
    } catch {
      /* best-effort */
    }
  }

  if (emailErr && !persisted) {
    // Both failed — surface error so user knows to call
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
  photoCount?: number;
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
      <tr><td style="padding:0 32px 8px 32px">${row("Telefon", `<a href="tel:${escape(f.phone)}" style="color:#1347a6">${escape(f.phone)}</a>`)}</td></tr>
      ${f.email ? `<tr><td style="padding:0 32px 8px 32px">${row("E-mail", `<a href="mailto:${escape(f.email)}" style="color:#1347a6">${escape(f.email)}</a>`)}</td></tr>` : ""}
      ${f.city ? `<tr><td style="padding:0 32px 8px 32px">${row("By", escape(f.city))}</td></tr>` : ""}
      ${f.photoCount ? `<tr><td style="padding:0 32px 8px 32px">${row("Billeder", `${f.photoCount} vedhæftet — se i bunden af mailen`)}</td></tr>` : ""}
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
    `Telefon:  ${f.phone}`,
    f.email ? `E-mail:   ${f.email}` : null,
    f.city ? `By:       ${f.city}` : null,
    f.photoCount ? `Billeder: ${f.photoCount} vedhæftet` : null,
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
