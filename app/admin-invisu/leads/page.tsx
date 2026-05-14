import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sql, hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COOKIE = "holstrup_admin";

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
  email_sent: boolean;
  email_error: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Stage = { key: string; label: string; rank: number };

function computeStage(r: LeadRow): Stage {
  if (r.submitted) return { key: "submitted", label: "Sendt", rank: 5 };
  if (r.message && r.message.length > 5) return { key: "message", label: "Skrev besked", rank: 4 };
  if (r.phone) return { key: "phone", label: "Skrev telefon", rank: 3 };
  if (r.email) return { key: "email", label: "Skrev email", rank: 2 };
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

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
  redirect("/admin-invisu/login");
}

export default async function AdminLeads({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get(COOKIE)?.value !== "ok") {
    redirect("/admin-invisu/login");
  }

  const sp = await searchParams;
  const q = (sp?.q ?? "").trim();
  const status = (sp?.status ?? "all").trim();

  let rows: LeadRow[] = [];
  let error: string | null = null;
  let total = 0;
  let last7d = 0;
  let totalSubmitted = 0;
  let totalDrafts = 0;

  if (!hasDb || !sql) {
    error = "DATABASE_URL ikke sat — provision Neon og redeploy.";
  } else {
    try {
      const search = q ? `%${q.toLowerCase()}%` : null;
      if (search && status !== "all") {
        rows = (await sql`
          SELECT * FROM holstrup_leads
          WHERE status = ${status}
            AND (LOWER(name) LIKE ${search}
              OR LOWER(email) LIKE ${search}
              OR LOWER(COALESCE(phone,'')) LIKE ${search}
              OR LOWER(COALESCE(city,'')) LIKE ${search})
          ORDER BY created_at DESC LIMIT 500;
        `) as LeadRow[];
      } else if (search) {
        rows = (await sql`
          SELECT * FROM holstrup_leads
          WHERE LOWER(name) LIKE ${search}
             OR LOWER(email) LIKE ${search}
             OR LOWER(COALESCE(phone,'')) LIKE ${search}
             OR LOWER(COALESCE(city,'')) LIKE ${search}
          ORDER BY created_at DESC LIMIT 500;
        `) as LeadRow[];
      } else if (status !== "all") {
        rows = (await sql`SELECT * FROM holstrup_leads WHERE status = ${status} ORDER BY created_at DESC LIMIT 500;`) as LeadRow[];
      } else {
        rows = (await sql`SELECT * FROM holstrup_leads ORDER BY created_at DESC LIMIT 500;`) as LeadRow[];
      }

      const counts = (await sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE submitted = TRUE)::int AS total_submitted,
          COUNT(*) FILTER (WHERE submitted = FALSE)::int AS total_drafts,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS last_7d
        FROM holstrup_leads;
      `) as Array<{ total: number; total_submitted: number; total_drafts: number; last_7d: number }>;
      total = counts[0]?.total ?? 0;
      last7d = counts[0]?.last_7d ?? 0;
      totalSubmitted = counts[0]?.total_submitted ?? 0;
      totalDrafts = counts[0]?.total_drafts ?? 0;
    } catch (e) {
      error = `DB-fejl: ${(e as Error).message}`;
    }
  }

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
            {totalSubmitted} sendt · {totalDrafts} drafts (påbegyndt men ikke sendt) · {last7d} aktivitet sidste 7 dage. Hver række er én besøgende.
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

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin-invisu/leads">
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
          <option value="new">Nye</option>
          <option value="contacted">Kontaktet</option>
          <option value="quoted">Tilbud sendt</option>
          <option value="won">Vundet</option>
          <option value="lost">Tabt</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-full bg-[#141618] px-5 text-[14px] font-medium text-white hover:opacity-90"
        >
          Søg
        </button>
      </form>

      <div
        className="mt-6 overflow-x-auto rounded-[16px] bg-white"
        style={{
          boxShadow: "0 1px 2px rgba(14,14,12,0.04), 0 8px 22px -14px rgba(14,14,12,0.10)",
        }}
      >
        <table className="w-full text-left text-[13.5px]">
          <thead className="bg-[#f4eee2] text-[11.5px] uppercase tracking-[0.12em] text-[#6e6557]">
            <tr>
              <th className="px-4 py-2.5 font-medium">Stadie</th>
              <th className="px-4 py-2.5 font-medium">Navn</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Telefon</th>
              <th className="px-4 py-2.5 font-medium">By</th>
              <th className="px-4 py-2.5 font-medium">Ydelse</th>
              <th className="px-4 py-2.5 font-medium">Mail</th>
              <th className="px-4 py-2.5 font-medium">Hvornår</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !error ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[#6e6557]">
                  Ingen henvendelser endnu.
                </td>
              </tr>
            ) : null}
            {rows.map((r) => {
              const stage = computeStage(r);
              return (
              <tr key={r.id} className="border-t border-[#ece5d2] align-top">
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.14em] ${stageClass(stage)}`}
                  >
                    {stage.label}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {r.name ?? <span className="text-[#6e6557]">—</span>}
                </td>
                <td className="px-4 py-3">
                  {r.email ? (
                    <a
                      href={`mailto:${r.email}`}
                      className="underline underline-offset-2 hover:text-[#1347a6]"
                    >
                      {r.email}
                    </a>
                  ) : (
                    <span className="text-[#6e6557]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.phone ? (
                    <a
                      href={`tel:${r.phone}`}
                      className="underline underline-offset-2 hover:text-[#1347a6]"
                    >
                      {r.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-[#6e6557]">{r.city ?? "—"}</td>
                <td className="px-4 py-3 text-[#6e6557]">{r.service ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.email_sent ? (
                    <span title="Mailen blev sendt til Finn" className="text-emerald-700">
                      ✓
                    </span>
                  ) : (
                    <span
                      title={r.email_error ?? "Mail ikke sendt"}
                      className="text-rose-700"
                    >
                      ✗
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#6e6557]">
                  {new Date(r.updated_at).toLocaleString("da-DK")}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      {rows.length > 0 ? (
        <details className="mt-8 rounded-[12px] bg-white p-5">
          <summary className="cursor-pointer text-[14px] font-medium">
            Vis beskeder ({rows.length})
          </summary>
          <ul className="mt-4 space-y-5">
            {rows
              .filter((r) => r.message && r.message.length > 5)
              .map((r) => (
                <li key={r.id} className="border-l-2 border-[#dbd0b9] pl-4">
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#6e6557]">
                    {r.name ?? "(uden navn)"} · {r.email ?? "(uden email)"}
                    {!r.submitted ? " · DRAFT" : ""}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-[14px] leading-[1.55]">
                    {r.message}
                  </p>
                </li>
              ))}
          </ul>
        </details>
      ) : null}
    </main>
  );
}
