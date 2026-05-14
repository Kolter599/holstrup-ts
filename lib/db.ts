import { neon } from "@neondatabase/serverless";

const url =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.NEON_DATABASE_URL;

if (!url && process.env.NODE_ENV === "production") {
  console.warn("[holstrup/db] No DATABASE_URL set — lead persistence will no-op.");
}

export const sql = url ? neon(url) : null;
export const hasDb = Boolean(url);
