// Pure rules for "has this lead been dealt with?". Kept free of DB and mail so
// they can be checked in isolation — see scripts/check-lead-rules.ts.

export type LeadFields = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  message?: string | null;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Danish numbers are 8 digits; allow +45, spaces and dashes. */
export function hasUsablePhone(phone?: string | null): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function hasUsableEmail(email?: string | null): boolean {
  const trimmed = (email ?? "").trim();
  return trimmed.length > 0 && trimmed.length <= 320 && EMAIL_RE.test(trimmed);
}

/** Can Finn actually reach this person? */
export function isReachable(f: LeadFields): boolean {
  return hasUsablePhone(f.phone) || hasUsableEmail(f.email);
}

/**
 * Whether an unfinished draft is worth a mail. A way to reach them is the
 * whole bar — no name, no city, no chosen service required. A number we can
 * ring beats a perfect form nobody sent, and the owner would rather ring one
 * wrong number than miss one real customer.
 */
export function isPartialNotifiable(f: LeadFields): boolean {
  return isReachable(f);
}

/** A submitted lead whose notification never made it out. */
export function needsEmailRetry(row: { submitted: boolean; email_sent: boolean }): boolean {
  return row.submitted && !row.email_sent;
}

// Four days, and the reminder is sent once per lead — never a daily nag. The
// status column only moves when someone clicks in the admin panel, so a lead
// Finn rang days ago still reads as 'new'. A reminder that repeats on that
// basis is wrong every day after the first, so it gets exactly one shot.
export const STALE_AFTER_MS = 4 * 24 * 60 * 60 * 1000;

/** Submitted, still untouched by Finn, and older than four days. */
export function isStale(
  row: { submitted: boolean; status: string; created_at: string | Date },
  now: Date = new Date(),
): boolean {
  if (!row.submitted || row.status !== "new") return false;
  const created = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
  if (Number.isNaN(created.getTime())) return false;
  return now.getTime() - created.getTime() >= STALE_AFTER_MS;
}

/** Don't send a second digest the same day, even if a new lead went stale. */
export const REMINDER_COOLDOWN_MS = 20 * 60 * 60 * 1000;

export function isReminderDue(lastReminderAt: string | Date | null, now: Date = new Date()): boolean {
  if (!lastReminderAt) return true;
  const last = lastReminderAt instanceof Date ? lastReminderAt : new Date(lastReminderAt);
  if (Number.isNaN(last.getTime())) return true;
  return now.getTime() - last.getTime() >= REMINDER_COOLDOWN_MS;
}
