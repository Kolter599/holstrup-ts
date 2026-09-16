import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql, hasDb } from "@/lib/db";
import { hasUsableEmail, hasUsablePhone } from "@/lib/lead-rules";
import { buildLeadHtml, buildLeadText, sendLeadMail, submitSubject } from "@/lib/lead-mail";
import { pushAlert } from "@/lib/alert";

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

  const name = (body.name || "").trim().slice(0, 200);
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim().slice(0, 4000);
  const city = (body.city || "").trim().slice(0, 120);
  const service = (body.service || "").trim().slice(0, 200);

  // A phone number is the whole lead. Everything else is a bonus — the old
  // form demanded name + phone + a 5-char message and lost 7 people out of 9.
  if (!hasUsablePhone(phone) || phone.length > 40) {
    return NextResponse.json({ error: "Angiv venligst et telefonnummer." }, { status: 400 });
  }
  if (email && !hasUsableEmail(email)) {
    return NextResponse.json({ error: "E-mail ser ikke rigtig ud." }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;
  const country =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;

  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.trim() ? body.sessionId.trim() : null;

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
  // We keep the returned id: the email outcome MUST be written back to this
  // exact row. (The old code matched on `email = …  AND created_at > NOW() -
  // 1 minute`, which missed every lead without an email and every lead whose
  // draft row was older than a minute — that is the 8 September lead that
  // Finn never heard about.)
  let leadId: string | null = null;
  const photoCount = attachments.length;
  const photoUrlsJson = photoUrls.length > 0 ? JSON.stringify(photoUrls) : null;

  if (hasDb && sql) {
    try {
      const rows = (await sql`
        INSERT INTO holstrup_leads (
          session_id, name, email, phone, city, service, message,
          user_agent, referrer, country, submitted, photo_count, photo_urls
        ) VALUES (
          ${sessionId}, ${name || null}, ${email || null}, ${phone},
          ${city || null}, ${service || null}, ${message || null},
          ${userAgent}, ${referrer}, ${country}, TRUE, ${photoCount},
          ${photoUrlsJson}::jsonb
        )
        ON CONFLICT (session_id) DO UPDATE SET
          name = COALESCE(EXCLUDED.name, holstrup_leads.name),
          email = COALESCE(EXCLUDED.email, holstrup_leads.email),
          phone = EXCLUDED.phone,
          city = COALESCE(EXCLUDED.city, holstrup_leads.city),
          service = COALESCE(EXCLUDED.service, holstrup_leads.service),
          message = COALESCE(EXCLUDED.message, holstrup_leads.message),
          submitted = TRUE,
          photo_count = GREATEST(holstrup_leads.photo_count, EXCLUDED.photo_count),
          photo_urls = COALESCE(EXCLUDED.photo_urls, holstrup_leads.photo_urls),
          updated_at = NOW()
        RETURNING id;
      `) as Array<{ id: string }>;
      leadId = rows[0]?.id ?? null;
    } catch (e) {
      console.error("[holstrup/contact] db insert failed", e);
    }
  }

  const fields = { name, email, phone, city, service, message, photoCount };
  const { sent, error } = await sendLeadMail({
    subject: submitSubject(fields),
    html: buildLeadHtml("submit", fields),
    text: buildLeadText("submit", fields),
    replyTo: email,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
  });
  // Always record the outcome on the row we just wrote. A failure here leaves
  // email_sent = false, which the hourly cron picks up and retries.
  if (leadId && hasDb && sql) {
    try {
      await sql`
        UPDATE holstrup_leads
        SET email_sent = ${sent},
            email_error = ${error},
            email_error_at = ${error ? new Date().toISOString() : null},
            updated_at = NOW()
        WHERE id = ${leadId};
      `;
    } catch (e) {
      console.error("[holstrup/contact] could not record mail outcome", e);
    }
  }

  // Mail is the thing that just broke, so the alert must not travel by mail.
  if (error) {
    console.error("[holstrup/contact] mail failed", error);
    await pushAlert(
      `mail til ${name || phone} kunne ikke sendes (${error.slice(0, 200)}). Ring ${phone}.`,
    );
  }

  if (!sent && !leadId) {
    // Nothing was stored and nothing was sent — this lead is genuinely lost,
    // so tell the visitor to call instead of pretending it went through.
    return NextResponse.json(
      { error: "Kunne ikke sende din besked lige nu. Ring venligst direkte." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
