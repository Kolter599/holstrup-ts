import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql, hasDb } from "@/lib/db";

export const runtime = "nodejs";

// Fired by a sendBeacon when a visitor gave name + phone but left before
// pressing Send on the final step. We persist the latest fields, then claim
// the row atomically (partial_notified flag) so we email Finn exactly once per
// session — no matter how many beacons / tab-switches fire.

type Body = {
  sessionId?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  service?: string;
  message?: string;
};

const FROM_DEFAULT = "Holstrup TS via Invisu <info@invisu.dk>";
const TO_FINN = "finn@holstrup-ts.dk";

type ClaimedRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
};

function isUuidLike(value: string): boolean {
  return /^[a-z0-9-]{8,64}$/i.test(value);
}

function clip(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.sessionId || !isUuidLike(body.sessionId)) {
    return NextResponse.json({ ok: false, error: "missing_session" }, { status: 400 });
  }
  // Dedupe relies on the DB flag. Without a DB we'd risk spamming Finn, so skip.
  if (!hasDb || !sql) {
    return NextResponse.json({ ok: true, notified: false });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;
  const country =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;

  // 1) Persist the latest fields (a late beacon may carry data the debounced
  //    draft never saved). Same COALESCE upsert as /api/contact-draft.
  try {
    await sql`
      INSERT INTO holstrup_leads (
        session_id, name, email, phone, city, service, message,
        user_agent, referrer, country
      ) VALUES (
        ${body.sessionId},
        ${clip(body.name, 200)},
        ${clip(body.email, 320)},
        ${clip(body.phone, 80)},
        ${clip(body.city, 120)},
        ${clip(body.service, 200)},
        ${clip(body.message, 4000)},
        ${userAgent}, ${referrer}, ${country}
      )
      ON CONFLICT (session_id) DO UPDATE SET
        name    = COALESCE(EXCLUDED.name, holstrup_leads.name),
        email   = COALESCE(EXCLUDED.email, holstrup_leads.email),
        phone   = COALESCE(EXCLUDED.phone, holstrup_leads.phone),
        city    = COALESCE(EXCLUDED.city, holstrup_leads.city),
        service = COALESCE(EXCLUDED.service, holstrup_leads.service),
        message = COALESCE(EXCLUDED.message, holstrup_leads.message),
        updated_at = NOW();
    `;
  } catch (e) {
    console.error("[contact-partial] upsert failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // 2) Atomically claim the alert. Only one beacon wins; a row comes back only
  //    if it's an un-submitted, not-yet-alerted lead with name + phone.
  let claimed: ClaimedRow | null = null;
  try {
    const rows = (await sql`
      UPDATE holstrup_leads
      SET partial_notified = TRUE, updated_at = NOW()
      WHERE session_id = ${body.sessionId}
        AND submitted = FALSE
        AND partial_notified = FALSE
        AND name IS NOT NULL
        AND phone IS NOT NULL
      RETURNING name, email, phone, city, service, message;
    `) as ClaimedRow[];
    claimed = rows[0] ?? null;
  } catch (e) {
    console.error("[contact-partial] claim failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!claimed) {
    return NextResponse.json({ ok: true, notified: false });
  }

  // 3) Best-effort alert email.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true, notified: false });
  }
  const fromAddress = process.env.RESEND_FROM ?? FROM_DEFAULT;
  const toAddress = process.env.CONTACT_TO_EMAIL ?? TO_FINN;

  const name = (claimed.name ?? "").trim();
  const email = (claimed.email ?? "").trim();
  const phone = (claimed.phone ?? "").trim();
  const city = (claimed.city ?? "").trim();
  const service = (claimed.service ?? "").trim();
  const message = (claimed.message ?? "").trim();

  const subject = `⚠️ Påbegyndt henvendelse (ikke afsendt) — ${name}${city ? ` (${city})` : ""}`;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email || undefined,
      subject,
      html: buildHtml({ name, email, phone, city, service, message }),
      text: buildText({ name, email, phone, city, service, message }),
    });
    if ("error" in result && result.error) {
      console.error("[contact-partial] resend error", result.error);
    }
  } catch (e) {
    console.error("[contact-partial] send threw", e);
  }

  return NextResponse.json({ ok: true, notified: true });
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
          <h1 style="margin:8px 0 0 0;font:400 26px/1.15 Georgia,serif;letter-spacing:-0.02em;color:#141618">Nogen begyndte en henvendelse — men nåede ikke at sende</h1>
          <p style="margin:14px 0 0 0;font:400 15.5px/1.55 Inter,sans-serif;color:#262a2d">Hej Finn — ${escape(f.name)} udfyldte sine kontaktoplysninger på holstrup-ts.dk, men trykkede ikke "Send" til sidst. Det er et varmt lead — ring til dem, før de finder en anden.</p>
        </td>
      </tr>
      <tr><td style="padding:16px 32px 8px 32px">${row("Navn", escape(f.name))}</td></tr>
      <tr><td style="padding:0 32px 8px 32px">${row("Telefon", `<a href="tel:${escape(f.phone)}" style="color:#1347a6">${escape(f.phone)}</a>`)}</td></tr>
      ${f.email ? `<tr><td style="padding:0 32px 8px 32px">${row("E-mail", `<a href="mailto:${escape(f.email)}" style="color:#1347a6">${escape(f.email)}</a>`)}</td></tr>` : ""}
      ${f.city ? `<tr><td style="padding:0 32px 8px 32px">${row("By", escape(f.city))}</td></tr>` : ""}
      ${f.service ? `<tr><td style="padding:0 32px 8px 32px">${row("Valgte", escape(f.service))}</td></tr>` : ""}
      ${
        f.message
          ? `<tr><td style="padding:16px 32px 8px 32px"><div style="font:500 12px/1.4 Inter,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:#6e6557;margin-bottom:8px">Det de nåede at skrive</div><div style="font:400 16px/1.7 Inter,sans-serif;color:#262a2d;white-space:pre-wrap">${escape(f.message)}</div></td></tr>`
          : `<tr><td style="padding:8px 32px"><div style="font:400 14px/1.55 Inter,sans-serif;color:#6e6557">(De nåede ikke at beskrive opgaven.)</div></td></tr>`
      }
      <tr><td style="padding:8px 32px 32px 32px"><p style="margin:0;font:400 13.5px/1.55 Inter,sans-serif;color:#6e6557">Svarer du på denne mail${f.email ? `, går svaret direkte til ${escape(f.name)}` : " (de har ikke oplyst e-mail — ring i stedet)"}.</p></td></tr>
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
    `Påbegyndt henvendelse på holstrup-ts.dk — ikke afsendt.`,
    ``,
    `${f.name} udfyldte kontaktoplysninger men trykkede ikke Send. Ring til dem.`,
    ``,
    `Navn:     ${f.name}`,
    `Telefon:  ${f.phone}`,
    f.email ? `E-mail:   ${f.email}` : null,
    f.city ? `By:       ${f.city}` : null,
    f.service ? `Valgte:   ${f.service}` : null,
    ``,
    f.message ? `Det de nåede at skrive:\n${f.message}` : `(De nåede ikke at beskrive opgaven.)`,
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
