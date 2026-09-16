import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sql, hasDb } from "@/lib/db";
import {
  buildLeadHtml,
  buildLeadText,
  forwardTo,
  sendLeadMail,
  submitSubject,
} from "@/lib/lead-mail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COOKIE = "holstrup_admin";
const PATH = "/admin-invisu/leads";

type LeadRow = {
  id: string;
  session_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  submitted: boolean;
  photo_count: number;
  photo_urls: string[] | null;
  email_sent: boolean;
  email_error: string | null;
  status: string;
  notes: string | null;
  source: string | null;
  email_error_at: string | null;
  forwarded_at: string | null;
  created_at: string;
  updated_at: string;
};

const STATUSES = [
  { key: "new", label: "Ny" },
  { key: "contacted", label: "Kontaktet" },
  { key: "quoted", label: "Tilbud sendt" },
  { key: "won", label: "Vundet" },
  { key: "lost", label: "Tabt" },
] as const;

type Stage = { key: string; label: string; rank: number };

// Funnel mirrors the form order: telefon → navn → ydelse → besked → sendt.
function computeStage(r: LeadRow): Stage {
  if (r.submitted) return { key: "submitted", label: "Sendt", rank: 5 };
  if (r.message && r.message.length > 5) return { key: "message", label: "Skrev besked", rank: 4 };
  if (r.email) return { key: "email", label: "Skrev email", rank: 3 };
  if (r.phone) return { key: "phone", label: "Skrev telefon", rank: 2 };
  if (r.name) return { key: "name", label: "Skrev navn", rank: 1 };
  return { key: "started", label: "Påbegyndt", rank: 0 };
}

function stageClass(stage: Stage): string {
  if (stage.key === "submitted") return "bg-[#141618] text-white";
  if (stage.key === "message") return "bg-emerald-700 text-white";
  if (stage.key === "phone" || stage.key === "email") return "bg-[#dbd0b9] text-[#141618]";
  if (stage.key === "name") return "bg-[#ece5d2] text-[#141618]";
  return "border border-[#dbd0b9] bg-transparent text-[#6e6557]";
}

function statusLabel(status: string): string {
  return STATUSES.find((s) => s.key === status)?.label ?? status;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get(COOKIE)?.value !== "ok") redirect("/admin-invisu/login");
}

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
  redirect("/admin-invisu/login");
}

async function setStatusAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.some((s) => s.key === status)) return;
  if (!hasDb || !sql) return;
  await sql`UPDATE holstrup_leads SET status = ${status}, updated_at = NOW() WHERE id = ${id};`;
  revalidatePath(PATH);
}

async function forwardAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || !hasDb || !sql) return;

  const rows = (await sql`
    SELECT name, email, phone, city, service, message, photo_count
    FROM holstrup_leads WHERE id = ${id};
  `) as Array<{
    name: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    service: string | null;
    message: string | null;
    photo_count: number;
  }>;
  const r = rows[0];
  if (!r) return;

  const fields = {
    name: (r.name ?? "").trim(),
    email: (r.email ?? "").trim(),
    phone: (r.phone ?? "").trim(),
    city: (r.city ?? "").trim(),
    service: (r.service ?? "").trim(),
    message: (r.message ?? "").trim(),
    photoCount: r.photo_count ?? 0,
  };
  // A resend of the same lead mail, without the bureau copy — the point of
  // the button is to reach Finn again, not to mail ourselves twice.
  const { sent } = await sendLeadMail({
    to: forwardTo(),
    cc: null,
    subject: submitSubject(fields),
    html: buildLeadHtml("submit", fields),
    text: buildLeadText("submit", fields),
    replyTo: fields.email,
  });
  if (sent) {
    await sql`UPDATE holstrup_leads SET forwarded_at = NOW(), updated_at = NOW() WHERE id = ${id};`;
  }
  revalidatePath(PATH);
}

async function saveNoteAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 4000);
  if (!id || !hasDb || !sql) return;
  await sql`UPDATE holstrup_leads SET notes = ${notes || null}, updated_at = NOW() WHERE id = ${id};`;
  revalidatePath(PATH);
}

export default async function AdminLeads({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const q = (sp?.q ?? "").trim();
  const status = (sp?.status ?? "all").trim();

  let rows: LeadRow[] = [];
  let error: string | null = null;
  let last7d = 0;
  let totalSubmitted = 0;
  let totalDrafts = 0;
  let unhandled = 0;
  let unsent = 0;

  if (!hasDb || !sql) {
    error = "DATABASE_URL ikke sat — provision Neon og redeploy.";
  } else {
    try {
      // Unhandled real leads first, then the rest of the sent ones, then
      // drafts. Finn should open this page and see exactly who to ring.
      const search = q ? `%${q.toLowerCase()}%` : null;
      if (search && status !== "all") {
        rows = (await sql`
          SELECT * FROM holstrup_leads
          WHERE status = ${status}
            AND (LOWER(COALESCE(name,'')) LIKE ${search}
              OR LOWER(COALESCE(email,'')) LIKE ${search}
              OR LOWER(COALESCE(phone,'')) LIKE ${search}
              OR LOWER(COALESCE(city,'')) LIKE ${search})
          ORDER BY (submitted AND status = 'new') DESC, submitted DESC, created_at DESC LIMIT 500;
        `) as LeadRow[];
      } else if (search) {
        rows = (await sql`
          SELECT * FROM holstrup_leads
          WHERE LOWER(COALESCE(name,'')) LIKE ${search}
             OR LOWER(COALESCE(email,'')) LIKE ${search}
             OR LOWER(COALESCE(phone,'')) LIKE ${search}
             OR LOWER(COALESCE(city,'')) LIKE ${search}
          ORDER BY (submitted AND status = 'new') DESC, submitted DESC, created_at DESC LIMIT 500;
        `) as LeadRow[];
      } else if (status !== "all") {
        rows = (await sql`
          SELECT * FROM holstrup_leads WHERE status = ${status}
          ORDER BY (submitted AND status = 'new') DESC, submitted DESC, created_at DESC LIMIT 500;
        `) as LeadRow[];
      } else {
        rows = (await sql`
          SELECT * FROM holstrup_leads
          ORDER BY (submitted AND status = 'new') DESC, submitted DESC, created_at DESC LIMIT 500;
        `) as LeadRow[];
      }

      const counts = (await sql`
        SELECT
          COUNT(*) FILTER (WHERE submitted = TRUE)::int AS total_submitted,
          COUNT(*) FILTER (WHERE submitted = FALSE)::int AS total_drafts,
          COUNT(*) FILTER (WHERE submitted = TRUE AND status = 'new')::int AS unhandled,
          COUNT(*) FILTER (WHERE submitted = TRUE AND email_sent = FALSE)::int AS unsent,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS last_7d
        FROM holstrup_leads;
      `) as Array<{
        total_submitted: number;
        total_drafts: number;
        unhandled: number;
        unsent: number;
        last_7d: number;
      }>;
      last7d = counts[0]?.last_7d ?? 0;
      totalSubmitted = counts[0]?.total_submitted ?? 0;
      totalDrafts = counts[0]?.total_drafts ?? 0;
      unhandled = counts[0]?.unhandled ?? 0;
      unsent = counts[0]?.unsent ?? 0;
    } catch (e) {
      error = `DB-fejl: ${(e as Error).message}`;
    }
  }

  const toCall = rows.filter((r) => r.submitted && r.status === "new");

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#6e6557]">
            Holstrup TS · Admin
          </div>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight">
            Henvendelser fra hjemmesiden
          </h1>
          <p className="mt-2 text-[13.5px] text-[#6e6557]">
            {totalSubmitted} sendt · {totalDrafts} påbegyndte · {last7d} aktivitet sidste 7 dage.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[13px] uppercase tracking-[0.18em] text-[#6e6557] hover:text-[#141618]"
          >
            Log ud →
          </button>
        </form>
      </header>

      {error ? (
        <div className="mt-6 rounded-[12px] border border-rose-300 bg-rose-50 p-4 text-[14px] text-rose-900">
          {error}
        </div>
      ) : null}

      {/* Mail er det, der kan være i stykker — så det skal stå her, ikke i en mail. */}
      {unsent > 0 ? (
        <div className="mt-6 rounded-[12px] border-2 border-rose-500 bg-rose-50 p-4 text-rose-900">
          <p className="text-[15px] font-semibold">
            {unsent} lead{unsent === 1 ? "" : "s"} kunne ikke sendes på mail
          </p>
          <p className="mt-1 text-[13.5px]">
            Oplysningerne er gemt — ring til dem nedenfor. Cron forsøger igen hver time; hold øje
            med fejlteksten på den enkelte henvendelse.
          </p>
        </div>
      ) : null}

      {/* Ring disse i dag — the whole point of the page */}
      {toCall.length > 0 ? (
        <section className="mt-6 rounded-[16px] border border-[#141618] bg-white p-5">
          <h2 className="text-[13px] uppercase tracking-[0.16em] text-[#6e6557]">
            Ring til disse ({unhandled} ubehandlede)
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {toCall.slice(0, 6).map((r) => (
              <li key={r.id} className="rounded-[12px] bg-[#f4eee2] p-4">
                <div className="text-[16px] font-semibold">{r.name ?? "(uden navn)"}</div>
                <div className="mt-1 text-[13px] text-[#6e6557]">
                  {[r.service, r.city].filter(Boolean).join(" · ") || "Ingen detaljer"}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.phone ? (
                    <a
                      href={`tel:${r.phone.replace(/\s/g, "")}`}
                      className="rounded-full bg-[#141618] px-4 py-2 text-[13px] font-medium text-white"
                    >
                      📞 Ring {r.phone}
                    </a>
                  ) : null}
                  {r.email ? (
                    <a
                      href={`mailto:${r.email}`}
                      className="rounded-full border border-[#dbd0b9] px-4 py-2 text-[13px]"
                    >
                      ✉️ Skriv
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form className="mt-6 flex flex-wrap items-center gap-3" action={PATH}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Søg navn / email / telefon / by…"
          className="h-10 w-full max-w-md rounded-full border border-[#dbd0b9] bg-white px-4 text-[14px] outline-none focus:border-[#141618]"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-full border border-[#dbd0b9] bg-white px-4 text-[14px]"
        >
          <option value="all">Alle</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-full bg-[#141618] px-5 text-[14px] font-medium text-white hover:opacity-90"
        >
          Søg
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {rows.length === 0 && !error ? (
          <p className="rounded-[16px] bg-white p-10 text-center text-[#6e6557]">
            Ingen henvendelser endnu.
          </p>
        ) : null}

        {rows.map((r) => {
          const stage = computeStage(r);
          const needsAttention = r.submitted && r.status === "new";
          return (
            <article
              key={r.id}
              className={`rounded-[16px] bg-white p-5 ${needsAttention ? "ring-2 ring-[#141618]" : ""}`}
              style={{ boxShadow: "0 1px 2px rgba(14,14,12,0.04), 0 8px 22px -14px rgba(14,14,12,0.10)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.14em] ${stageClass(stage)}`}
                    >
                      {stage.label}
                    </span>
                    {r.submitted ? (
                      <span className="text-[11px] uppercase tracking-[0.14em] text-[#6e6557]">
                        {statusLabel(r.status)}
                      </span>
                    ) : null}
                    {r.submitted && !r.email_sent ? (
                      <span
                        title={r.email_error ?? "Mail ikke sendt — cron prøver igen hver time"}
                        className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] text-rose-800"
                      >
                        mail ikke sendt
                        {r.email_error_at
                          ? ` · ${new Date(r.email_error_at).toLocaleString("da-DK")}`
                          : ""}
                      </span>
                    ) : null}
                    {r.forwarded_at ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-800">
                        videresendt
                      </span>
                    ) : null}
                    {r.photo_count > 0 ? (
                      <span className="rounded-full bg-[#dbd0b9] px-2 py-0.5 text-[11px]">
                        📸 {r.photo_count}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-[17px] font-semibold">
                    {r.name ?? <span className="text-[#6e6557]">(uden navn)</span>}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#6e6557]">
                    {[r.service, r.city, r.source].filter(Boolean).join(" · ") || "—"} ·{" "}
                    {new Date(r.created_at).toLocaleString("da-DK")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.phone ? (
                    <a
                      href={`tel:${r.phone.replace(/\s/g, "")}`}
                      className="rounded-full bg-[#141618] px-4 py-2 text-[13px] font-medium text-white"
                    >
                      📞 {r.phone}
                    </a>
                  ) : null}
                  {r.email ? (
                    <a
                      href={`mailto:${r.email}`}
                      className="rounded-full border border-[#dbd0b9] px-4 py-2 text-[13px]"
                    >
                      ✉️ {r.email}
                    </a>
                  ) : null}
                </div>
              </div>

              {r.message ? (
                <p className="mt-3 whitespace-pre-wrap border-l-2 border-[#dbd0b9] pl-4 text-[14px] leading-[1.55]">
                  {r.message}
                </p>
              ) : null}

              {r.photo_urls && r.photo_urls.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {r.photo_urls.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-20 w-20 overflow-hidden rounded-md border border-[#dbd0b9] bg-white hover:border-[#141618]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Billede ${i + 1} fra ${r.name ?? "lead"}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}

              {r.email_error ? (
                <p className="mt-3 rounded-[10px] bg-rose-50 p-3 font-mono text-[12px] text-rose-900">
                  {r.email_error}
                </p>
              ) : null}

              {r.submitted ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ece5d2] pt-4">
                  <form action={forwardAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-[#1347a6] px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:opacity-90"
                    >
                      {r.forwarded_at ? "Videresend igen" : "Videresend"}
                    </button>
                  </form>
                  <span className="mx-1 h-4 w-px bg-[#dbd0b9]" aria-hidden />
                  {STATUSES.map((s) => (
                    <form key={s.key} action={setStatusAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value={s.key} />
                      <button
                        type="submit"
                        disabled={r.status === s.key}
                        className={
                          "rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors " +
                          (r.status === s.key
                            ? "bg-[#141618] text-white"
                            : "border border-[#dbd0b9] text-[#6e6557] hover:border-[#141618] hover:text-[#141618]")
                        }
                      >
                        {s.label}
                      </button>
                    </form>
                  ))}
                </div>
              ) : null}

              {r.submitted ? (
                <form action={saveNoteAction} className="mt-3 flex flex-wrap items-start gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <textarea
                    name="notes"
                    defaultValue={r.notes ?? ""}
                    rows={2}
                    placeholder="Note — hvad blev aftalt?"
                    className="min-w-[240px] flex-1 rounded-[10px] border border-[#dbd0b9] bg-white p-3 text-[13.5px] outline-none focus:border-[#141618]"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-[#dbd0b9] px-4 py-2 text-[13px] hover:border-[#141618]"
                  >
                    Gem note
                  </button>
                </form>
              ) : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
