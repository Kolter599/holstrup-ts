-- Photo upload support. Holstrup contact form now lets visitors attach up
-- to 5 photos of the job. Photos are emailed to Finn as Resend attachments
-- (not stored in DB — Resend keeps them in the original email). We just
-- track the count so admin sees which leads came with photos.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS photo_count INT NOT NULL DEFAULT 0;
