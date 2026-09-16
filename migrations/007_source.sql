-- Hvilken side leadet kom fra. Formularen ligger nu i bunden af ydelses-,
-- by-, projekt- og blogsider, så "hvor virker siden" er et spørgsmål vi
-- faktisk kan svare på — og Finn kan se konteksten i mailen.

ALTER TABLE holstrup_leads ADD COLUMN IF NOT EXISTS source TEXT;
