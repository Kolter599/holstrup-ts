import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { SITE } from "@/lib/site";
import {
  buildLeadHtml,
  buildLeadText,
  buildReminderHtml,
  buildReminderText,
  reminderSubject,
  sendLeadMail,
  submitSubject,
  type ReminderLead,
} from "@/lib/lead-mail";
import { notifyPartial } from "@/lib/lead-notify";
import { isPartialNotifiable, isReminderDue } from "@/lib/lead-rules";
import { pushAlert } from "@/lib/alert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hourly safety net so no lead can rot unnoticed:
//   1. resend the notification for submitted leads whose mail never went out
//   2. mail Finn about drafts that were abandoned without a description
//   3. once — and only once — remind him about a lead that has sat at
//      status = 'new' for four days
//
// Protected with CRON_SECRET (Vercel sends it as a bearer token automatically).

const ADMIN_URL = `${SITE.url}/admin-invisu/leads`;
// Drafts get a 60-minute grace period (inlined in the SQL below — an interval
// can't be a bind parameter) before we call them abandoned. This cron is the
// ONLY thing that mails about an unfinished form: filling in your name and
// number is not yet a lead, and mailing on that keystroke buried the real ones.
const BATCH = 20;

type Row = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
  photo_count: number;
  created_at: string;
};

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!hasDb || !sql) {
    return NextResponse.json({ error: "no database" }, { status: 500 });
  }

  const retried = await retryFailedSubmits();
  const drafts = await notifyMissedDrafts();
  const reminded = await remindStaleLeads();

  return NextResponse.json({ ok: true, retried, drafts, reminded });
}

/* ------------------------- 1. retry failed mails ------------------------- */

async function retryFailedSubmits(): Promise<number> {
  if (!sql) return 0;
  const rows = (await sql`
    SELECT id, name, email, phone, city, service, message, photo_count, created_at
    FROM holstrup_leads
    WHERE submitted = TRUE AND email_sent = FALSE
    ORDER BY created_at ASC
    LIMIT ${BATCH};
  `) as Row[];

  let count = 0;
  const stuck: Row[] = [];
  for (const row of rows) {
    const fields = toFields(row);
    const { sent, error } = await sendLeadMail({
      subject: submitSubject(fields),
      html: buildLeadHtml("submit", fields),
      text: buildLeadText("submit", fields),
      replyTo: fields.email,
    });
    await sql`
      UPDATE holstrup_leads
      SET email_sent = ${sent},
          email_error = ${error},
          email_error_at = ${error ? new Date().toISOString() : null},
          updated_at = NOW()
      WHERE id = ${row.id};
    `;
    if (sent) {
      count++;
    } else {
      console.error("[holstrup/cron] retry failed", row.id, error);
      // Older than an hour and still not out: mail is not going to save us.
      if (Date.now() - new Date(row.created_at).getTime() > 60 * 60 * 1000) stuck.push(row);
    }
  }

  if (stuck.length > 0) {
    const names = stuck.map((r) => `${r.name || "?"} ${r.phone || ""}`.trim()).join(", ");
    await pushAlert(
      `${stuck.length} lead${stuck.length === 1 ? "" : "s"} har ikke kunnet sendes på mail i over en time: ${names}`,
    );
  }
  return count;
}

/* --------------------- 2. drafts the beacon never sent -------------------- */

async function notifyMissedDrafts(): Promise<number> {
  if (!sql) return 0;
  const rows = (await sql`
    SELECT id, name, email, phone, city, service, message, photo_count, created_at
    FROM holstrup_leads
    WHERE submitted = FALSE
      AND partial_notified = FALSE
      AND updated_at < NOW() - INTERVAL '60 minutes'
      AND updated_at > NOW() - INTERVAL '30 days'
    ORDER BY updated_at DESC
    LIMIT ${BATCH};
  `) as Row[];

  let count = 0;
  for (const row of rows) {
    if (!isPartialNotifiable(row)) continue;
    // Claim first so a beacon arriving mid-flight can't double-mail.
    const claimed = (await sql`
      UPDATE holstrup_leads SET partial_notified = TRUE, updated_at = NOW()
      WHERE id = ${row.id} AND partial_notified = FALSE
      RETURNING id;
    `) as Array<{ id: string }>;
    if (claimed.length === 0) continue;

    if (await notifyPartial(row)) count++;
    else await sql`UPDATE holstrup_leads SET partial_notified = FALSE WHERE id = ${row.id};`;
  }
  return count;
}

/* ------------- 3. one reminder per lead, four days after it came ---------- */

async function remindStaleLeads(): Promise<number> {
  if (!sql) return 0;

  const last = (await sql`
    SELECT MAX(reminder_sent_at) AS last FROM holstrup_leads;
  `) as Array<{ last: string | null }>;
  if (!isReminderDue(last[0]?.last ?? null)) return 0;

  const rows = (await sql`
    SELECT id, name, email, phone, city, service, message, photo_count, created_at
    FROM holstrup_leads
    WHERE submitted = TRUE
      AND status = 'new'
      AND created_at < NOW() - INTERVAL '4 days'
      AND reminder_sent_at IS NULL
    ORDER BY created_at ASC
    LIMIT 50;
  `) as Row[];

  if (rows.length === 0) return 0; // nothing to nag about — send nothing

  const leads: ReminderLead[] = rows.map((r) => ({
    ...toFields(r),
    createdAt: new Date(r.created_at),
    adminUrl: ADMIN_URL,
  }));

  const { sent, error } = await sendLeadMail({
    subject: reminderSubject(leads),
    html: buildReminderHtml(leads),
    text: buildReminderText(leads),
    cc: null, // the nudge is Finn's alone; we already saw the lead when it came in
  });
  if (!sent) {
    console.error("[holstrup/cron] reminder failed", error);
    return 0;
  }

  const ids = rows.map((r) => r.id);
  await sql`UPDATE holstrup_leads SET reminder_sent_at = NOW() WHERE id = ANY(${ids}::uuid[]);`;
  return rows.length;
}

function toFields(r: Row) {
  return {
    name: (r.name ?? "").trim(),
    email: (r.email ?? "").trim(),
    phone: (r.phone ?? "").trim(),
    city: (r.city ?? "").trim(),
    service: (r.service ?? "").trim(),
    message: (r.message ?? "").trim(),
    photoCount: r.photo_count ?? 0,
  };
}
