import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE = "holstrup_admin";

async function loginAction(formData: FormData) {
  "use server";
  const expected = process.env.ADMIN_PASSWORD;
  const password = String(formData.get("password") ?? "");
  if (!expected) return;
  if (password === expected) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE, "ok", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: 60 * 60 * 24 * 14,
    });
    redirect("/admin/leads");
  }
  redirect("/admin/login?err=1");
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const sp = await searchParams;
  const failed = sp?.err === "1";

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl border border-[#dbd0b9] bg-white p-8"
        style={{
          boxShadow: "0 1px 2px rgba(14,14,12,0.04), 0 18px 40px -22px rgba(14,14,12,0.20)",
        }}
      >
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#6e6557]">
          Holstrup TS · Admin
        </div>
        <h1 className="mt-3 text-[24px] font-semibold leading-tight">Log ind</h1>
        <p className="mt-2 text-[14px] text-[#6e6557]">
          Adgangskode sættes via <code>ADMIN_PASSWORD</code> i Vercel.
        </p>
        <label className="mt-6 block">
          <span className="text-[12px] uppercase tracking-[0.14em] text-[#6e6557]">
            Adgangskode
          </span>
          <input
            type="password"
            name="password"
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full rounded-[10px] border border-[#dbd0b9] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#141618]"
          />
        </label>
        {failed ? (
          <p className="mt-3 text-[13px] text-rose-700">Forkert adgangskode.</p>
        ) : null}
        <button
          type="submit"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#141618] px-5 text-[14.5px] font-medium text-white hover:opacity-90"
        >
          Log ind →
        </button>
      </form>
    </main>
  );
}
