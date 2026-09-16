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
 * Do we know anything at all about who they are or what they want? A phone
 * number on its own could be a typo; a phone number plus a name, a city, a
 * chosen service or a half-written message is a warm lead.
 */
export function hasJobContext(f: LeadFields): boolean {
  const filled = (v?: string | null) => Boolean(v && v.trim().length >= 2);
  return filled(f.name) || filled(f.city) || filled(f.service) || filled(f.message);
}

/**
 * Whether an abandoned draft is worth mailing Finn about. Deliberately loose:
 * an abandoned draft with a phone number beats a perfect form nobody sent.
 */
export function isPartialNotifiable(f: LeadFields): boolean {
  return isReachable(f) && hasJobContext(f);
}

/** A submitted lead whose notification never made it out. */
export function needsEmailRetry(row: { submitted: boolean; email_sent: boolean }): boolean {
  return row.submitted && !row.email_sent;
}

export const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

/** Submitted, still untouched by Finn, and older than a day. */
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
