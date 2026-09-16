-- Daily reminder about leads that are still sitting at status = 'new'.
-- Stamped on every lead included in a reminder mail, so (a) the same lead is
-- never nagged about twice within 24 hours and (b) MAX(reminder_sent_at) tells
-- the cron whether a digest already went out today — no extra table needed.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS holstrup_leads_unhandled_idx
  ON holstrup_leads (submitted, status, created_at DESC);
