-- Users (managed by Supabase Auth, but we can have public Profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Themes (Styles for the bio page)
CREATE TABLE IF NOT EXISTS themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    styles JSONB NOT NULL, -- Example: {"bg": "linear-gradient(to bottom, #000, #111)", "text": "#fff", "button_type": "glass"}
    is_premium BOOLEAN DEFAULT false
);

-- Link profiles to themes
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES themes(id);

-- Links (The actual links on the bio page)
CREATE TABLE IF NOT EXISTS links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Link Rules (Smart logic: time-based, click limits, location, etc.)
CREATE TABLE IF NOT EXISTS link_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID REFERENCES links(id) ON DELETE CASCADE NOT NULL,
    rule_type TEXT NOT NULL, -- 'time_based', 'click_limit', 'location_based'
    config JSONB, -- Example: {"start_time": "18:00", "end_time": "06:00"} or {"max_clicks": 100}
    is_active BOOLEAN DEFAULT true
);

-- Click Analytics (Detailed tracking for the user)
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT now(),
    user_agent TEXT,
    referrer TEXT,
    location TEXT -- country code based on IP (ISO code)
);

-- Subscriptions (Free vs Pro)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro'
    status TEXT NOT NULL, -- 'active', 'canceled'
    current_period_end TIMESTAMPTZ
);
