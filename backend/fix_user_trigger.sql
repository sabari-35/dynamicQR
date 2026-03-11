-- ==========================================================================
-- FIX: Auto-create a public.users row on Supabase Auth signup
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ==========================================================================

-- 1. Function that copies the new auth user into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, plan, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Idempotent: ignore if already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger: fires after every new Supabase Auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill: Insert rows for any existing auth users missing from public.users
INSERT INTO public.users (id, email, full_name, plan, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    'free',
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;


-- ==========================================================================
-- FIX: Allow public (anonymous) read access to qr_codes so QR redirect works
-- ==========================================================================

-- Drop old combined policy if exists, recreate separate policies
DROP POLICY IF EXISTS "Users can manage own qr_codes" ON public.qr_codes;

-- Public can read any qr_code by short_id (needed for redirect engine)
CREATE POLICY "Public can read qr_codes for redirect"
  ON public.qr_codes FOR SELECT
  USING (true);

-- Authenticated users can insert/update/delete only their own QR codes
CREATE POLICY "Users can insert own qr_codes"
  ON public.qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qr_codes"
  ON public.qr_codes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own qr_codes"
  ON public.qr_codes FOR DELETE
  USING (auth.uid() = user_id);


-- ==========================================================================
-- FIX: Allow backend service to insert scan_logs (no auth on scan events)
-- ==========================================================================
DROP POLICY IF EXISTS "Backend scan log insert" ON public.scan_logs;
CREATE POLICY "Backend scan log insert"
  ON public.scan_logs FOR INSERT
  WITH CHECK (true);
