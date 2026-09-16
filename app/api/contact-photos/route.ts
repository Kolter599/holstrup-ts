import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql, hasDb } from "@/lib/db";
import { escapeHtml, sendLeadMail } from "@/lib/lead-mail";

export const runtime = "nodejs";

// Photos are asked for AFTER the lead is captured — on mobile, an upload in
// the middle of a form is exactly where people give up. This appends them to
// the existing row and sends Finn a short follow-up mail.

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

type LeadRow = { id: string; name: string | null; phone: string | null; photo_urls: string[] | null };

export async function POST(req: Request) {
  if (!hasDb || !sql) {
    return NextResponse.json({ error: "no database" }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  const sessionId = String(form.get("sessionId") ?? "").trim();
  if (!/^[a-z0-9-]{8,64}$/i.test(sessionId)) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  const rows = (await sql`
    SELECT id, name, phone, photo_urls FROM holstrup_leads WHERE session_id = ${sessionId};
  `) as LeadRow[];
  const lead = rows[0];
  if (!lead) {
    return NextResponse.json({ error: "unknown_lead" }, { status: 404 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "uploads_not_configured" }, { status: 500 });
  }

  const folder = `holstrup-leads/${sessionId}-extra-${Date.now()}`;
  const uploaded: string[] = [];
  for (let i = 0; i < MAX_PHOTOS; i++) {
    const f = form.get(`photo_${i}`);
    if (!(f instanceof File) || f.size === 0) continue;
    if (f.size > MAX_PHOTO_BYTES || !f.type.startsWith("image/")) continue;
    try {
      const result = await put(`${folder}/${i}-${f.name}`, Buffer.from(await f.arrayBuffer()), {
        access: "public",
        contentType: f.type,
        addRandomSuffix: true,
      });
      uploaded.push(result.url);
    } catch (e) {
      console.error("[holstrup/contact-photos] blob upload failed", e);
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json({ error: "Ingen billeder blev gemt." }, { status: 400 });
  }

  const all = [...(lead.photo_urls ?? []), ...uploaded];
  try {
    await sql`
      UPDATE holstrup_leads
      SET photo_urls = ${JSON.stringify(all)}::jsonb,
          photo_count = ${all.length},
          updated_at = NOW()
      WHERE id = ${lead.id};
    `;
  } catch (e) {
    console.error("[holstrup/contact-photos] db update failed", e);
  }

  const who = lead.name || lead.phone || "En besøgende";
  const list = uploaded
    .map((u) => `<li><a href="${escapeHtml(u)}" style="color:#1347a6">${escapeHtml(u)}</a></li>`)
    .join("");
  const { error } = await sendLeadMail({
    subject: `${uploaded.length} billede${uploaded.length === 1 ? "" : "r"} til henvendelsen fra ${who}`,
    html: `<p style="font:400 15.5px/1.55 Inter,sans-serif">${escapeHtml(who)} har sendt ${uploaded.length} billede${uploaded.length === 1 ? "" : "r"} til sin henvendelse${lead.phone ? ` — ring på <a href="tel:${escapeHtml(lead.phone.replace(/\s/g, ""))}" style="color:#1347a6">${escapeHtml(lead.phone)}</a>` : ""}.</p><ul>${list}</ul>`,
    text: `${who} har sendt ${uploaded.length} billede(r)${lead.phone ? ` — ring på ${lead.phone}` : ""}.\n\n${uploaded.join("\n")}`,
  });
  if (error) console.error("[holstrup/contact-photos] mail failed", error);

  return NextResponse.json({ ok: true, count: uploaded.length });
}
