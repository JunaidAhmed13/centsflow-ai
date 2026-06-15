-- Run this in the Supabase SQL editor at:
-- https://supabase.com/dashboard/project/pxeqexdhxtnmjmxvnpzf/sql

-- 1. Add user_id column (text) if it doesn't already exist
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 2. Index for fast per-user + date queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_id
  ON expenses (user_id);

CREATE INDEX IF NOT EXISTS idx_expenses_user_created
  ON expenses (user_id, created_at DESC);

-- 3. Add currency column if missing (matches new schema)
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'PKR';

-- ─── Row Level Security (optional but recommended) ────────────────────────
-- Since we use the service_role key server-side, RLS is bypassed automatically.
-- Enable it as a defence-in-depth measure anyway.

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow service role to read/write everything (used by the Next.js backend)
CREATE POLICY "service_role_all" ON expenses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── n8n INSERT template ─────────────────────────────────────────────────
-- In your n8n Supabase node, set the "user_id" field to the WhatsApp
-- sender's phone number (or a mapped Clerk userId if you maintain a
-- phone→userId lookup table):
--
--  {
--    "amount":      {{ $json.amount }},
--    "currency":    "PKR",
--    "category":    "{{ $json.category }}",
--    "description": "{{ $json.description }}",
--    "user_id":     "{{ $json.from }}"   ← phone number e.g. "923001234567"
--  }
--
-- On the Clerk side, store the user's phone number in their public metadata
-- so the dashboard server action can look it up:
--   const { userId, sessionClaims } = auth()
--   const phone = sessionClaims?.publicMetadata?.phone
-- Then filter: .eq('user_id', phone)
