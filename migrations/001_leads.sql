-- Holstrup TS lead capture (incl. partial drafts).
-- Table is namespaced `holstrup_leads` so it coexists safely with NDRP's
-- `leads` table on the shared Neon DB.
--
-- Each visitor session has one row. We upsert by session_id as they type,
-- then flip `submitted` to true on the actual Send click. Lets us see leads
-- even when people fill 90% of the form and bail.

CREATE TABLE IF NOT EXISTS holstrup_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  service TEXT,
  message TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  submitted BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  email_error TEXT,
  status TEXT NOT NULL DEFAULT 'new',  -- new | contacted | quoted | won | lost
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS holstrup_leads_created_idx   ON holstrup_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS holstrup_leads_email_idx     ON holstrup_leads (lower(email));
CREATE INDEX IF NOT EXISTS holstrup_leads_status_idx    ON holstrup_leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS holstrup_leads_submitted_idx ON holstrup_leads (submitted, created_at DESC);
