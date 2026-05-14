-- Store uploaded photo URLs (Vercel Blob) on lead rows so admin can render
-- thumbnails. Photos are also still attached to the email to Finn — Blob
-- gives us long-term persistence + admin preview.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS photo_urls JSONB;
