-- Holstrup TS lead capture. Every contact-form submission lands here so
-- Finn (and Sebastian via /admin/leads) can see them all in one place,
-- not just rely on email.

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  service TEXT,
  message TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  email_error TEXT,
  status TEXT NOT NULL DEFAULT 'new',  -- new | contacted | quoted | won | lost
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx   ON leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_status_idx  ON leads (status, created_at DESC);
