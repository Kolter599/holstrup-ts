import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { isPartialNotifiable } from "@/lib/lead-rules";
import { notifyPartial, type PartialRow } from "@/lib/lead-notify";

export const runtime = "nodejs";

// Fired by a sendBeacon when a visitor gave us something to call them on but
// left before pressing Send. We persist the latest fields, then claim the row
// atomically (partial_notified flag) so we email Finn exactly once per session
// — no matter how many beacons / tab-switches fire.

type Body = {
  sessionId?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  service?: string;
  message?: string;
  source?: string;
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
        user_agent, referrer, country, source
      ) VALUES (
        ${body.sessionId},
        ${clip(body.name, 200)},
        ${clip(body.email, 320)},
        ${clip(body.phone, 80)},
        ${clip(body.city, 120)},
        ${clip(body.service, 200)},
        ${clip(body.message, 4000)},
        ${userAgent}, ${referrer}, ${country},
        ${clip(body.source, 300)}
      )
      ON CONFLICT (session_id) DO UPDATE SET
        name    = COALESCE(EXCLUDED.name, holstrup_leads.name),
        email   = COALESCE(EXCLUDED.email, holstrup_leads.email),
        phone   = COALESCE(EXCLUDED.phone, holstrup_leads.phone),
        city    = COALESCE(EXCLUDED.city, holstrup_leads.city),
        service = COALESCE(EXCLUDED.service, holstrup_leads.service),
        message = COALESCE(EXCLUDED.message, holstrup_leads.message),
        source  = COALESCE(holstrup_leads.source, EXCLUDED.source),
        updated_at = NOW();
    `;
  } catch (e) {
    console.error("[contact-partial] upsert failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // 2) Atomically claim the alert: one beacon wins, and only for a draft that
  //    is actually worth a phone call. The old SQL required name AND phone —
  //    a draft with a phone number and a chosen service now counts too, which
  //    is where 6 of the 7 abandoned drafts were being dropped.
  let claimed: (PartialRow & { id: string }) | null = null;
  try {
    const rows = (await sql`
      UPDATE holstrup_leads
      SET partial_notified = TRUE, updated_at = NOW()
      WHERE session_id = ${body.sessionId}
        AND submitted = FALSE
        AND partial_notified = FALSE
      RETURNING id, name, email, phone, city, service, message, source;
    `) as Array<PartialRow & { id: string }>;
    claimed = rows[0] ?? null;
  } catch (e) {
    console.error("[contact-partial] claim failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!claimed) {
    return NextResponse.json({ ok: true, notified: false });
  }

  // Not worth a mail yet (no way to reach them, or nothing about the job).
  // Hand the claim back so a later beacon with more fields can take it.
  if (!isPartialNotifiable(claimed)) {
    await releaseClaim(claimed.id);
    return NextResponse.json({ ok: true, notified: false });
  }

  const sent = await notifyPartial(claimed);
  if (!sent) await releaseClaim(claimed.id);

  return NextResponse.json({ ok: true, notified: sent });
}

/** Un-claim so the hourly cron (or a later beacon) tries again. */
async function releaseClaim(id: string): Promise<void> {
  if (!hasDb || !sql) return;
  try {
    await sql`UPDATE holstrup_leads SET partial_notified = FALSE WHERE id = ${id};`;
  } catch (e) {
    console.error("[contact-partial] release failed", e);
  }
}
