-- Supabase Postgres Schema for Dynamic QR Code SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (Extended via Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    plan TEXT DEFAULT 'free', -- 'free', 'pro'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Folders
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- QR Codes
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    short_id TEXT UNIQUE NOT NULL,
    destination_url TEXT NOT NULL,
    is_dynamic BOOLEAN DEFAULT TRUE,
    qr_design_settings JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMP WITH TIME ZONE,
    scan_limit INTEGER,
    password_hash TEXT,
    custom_landing_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Scan Logs (Analytics)
CREATE TABLE IF NOT EXISTS public.scan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT, -- mobile, tablet, desktop
    os TEXT,
    browser TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
-- Scan logs generally only written via backend machine, no RLS needed for insert, read via RLS for user
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- Helper policies
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own folders" ON public.folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own qr_codes" ON public.qr_codes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own scan logs" ON public.scan_logs FOR SELECT USING (
    qr_id IN (SELECT id FROM public.qr_codes WHERE user_id = auth.uid())
);
-- Backend API will use Service Role Key to insert scan_logs bypassing RLS.
