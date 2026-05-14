import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";

export const runtime = "nodejs";

type Body = {
  sessionId?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  service?: string;
  message?: string;
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
  if (!hasDb || !sql) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;
  const country =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? null;

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
    return NextResponse.json({ ok: true, persisted: true });
  } catch (e) {
    console.error("[contact-draft] insert failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
