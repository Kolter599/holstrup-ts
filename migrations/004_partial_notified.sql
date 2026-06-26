-- Alert Finn about "warm" leads who gave contact info (name + phone) but never
-- pressed Send on the final step. We flag the row once an alert has gone out so
-- abandon-beacons + mobile tab-switches don't spam — exactly one partial alert
-- per session. Visitors who later complete still get the normal submit email.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS partial_notified BOOLEAN NOT NULL DEFAULT FALSE;
