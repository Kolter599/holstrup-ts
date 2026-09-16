-- When a lead mail failed, not just that it failed. Lets the admin say "kunne
-- ikke sendes for 3 timer siden" and lets the cron escalate a lead that has
-- been stuck unsent for more than an hour.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS email_error_at TIMESTAMPTZ;

-- "Videresend til Finn" i admin — så knappen kan vise at det allerede er gjort.
ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS forwarded_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS holstrup_leads_unsent_idx
  ON holstrup_leads (submitted, email_sent, created_at DESC);
