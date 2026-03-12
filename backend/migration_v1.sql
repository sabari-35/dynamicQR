-- Run this in your Supabase SQL Editor to add the missing columns
ALTER TABLE public.qr_codes 
ADD COLUMN IF NOT EXISTS qr_type TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
