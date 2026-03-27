-- ##################################################################
-- 1. TABLES
-- ##################################################################

-- Profiles: Linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    theme TEXT DEFAULT 'minimal',
    button_style TEXT DEFAULT 'rounded',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration for existing databases (safe to run even if columns exist)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'minimal';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'rounded';

-- Themes (Styles for the bio page)
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    styles JSONB NOT NULL, -- Example: {"bg": "#000", "text": "#fff", "button_type": "glass"}
    is_premium BOOLEAN DEFAULT false
);

-- Link profiles to themes
ALTER TABLE public.profiles ADD CONSTRAINT fk_theme FOREIGN KEY (theme_id) REFERENCES public.themes(id);

-- Links: The actual link items
CREATE TABLE IF NOT EXISTS public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Link Rules: Smart logic
CREATE TABLE IF NOT EXISTS public.link_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
    rule_type TEXT NOT NULL, -- 'time_based', 'click_limit', 'location_based'
    config JSONB, 
    is_active BOOLEAN DEFAULT true
);

-- Click Analytics
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT now(),
    user_agent TEXT,
    referrer TEXT,
    location TEXT -- country code based on IP
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro'
    status TEXT NOT NULL, 
    current_period_end TIMESTAMPTZ
);

-- ##################################################################
-- 2. AUTOMATIC PROFILE CREATION (TRIGGER)
-- ##################################################################

-- This function automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  base_username := LOWER(SPLIT_PART(new.email, '@', 1));
  final_username := base_username;
  
  -- If username exists, append a random string
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || floor(random() * 10000)::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    final_username,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ##################################################################
-- 3. ROW LEVEL SECURITY (RLS)
-- ##################################################################

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Viewable by anyone, Editable only by owner
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Links: Viewable by everyone, Managed only by profile owner
CREATE POLICY "Links of visible profiles are viewable by everyone" ON public.links FOR SELECT USING (true);
CREATE POLICY "Users can maintain their own links" ON public.links FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

-- Rules: Viewable by everyone (to process smart logic), Managed by owner
CREATE POLICY "Rules are viewable by everyone" ON public.link_rules FOR SELECT USING (true);
CREATE POLICY "Users can maintain their own link rules" ON public.link_rules FOR ALL USING (
  link_id IN (SELECT id FROM public.links WHERE profile_id = auth.uid())
);

-- Analytics: Anyone can insert (to track clicks), only owner can view
CREATE POLICY "Anyone can record clicks (insert only)" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own link performance" ON public.analytics FOR SELECT USING (profile_id = auth.uid());

-- ##################################################################
-- 4. RPC FUNCTIONS
-- ##################################################################

-- Function to count unique visitors based on profile_id
CREATE OR REPLACE FUNCTION public.get_unique_visitors_count(pid UUID)
RETURNS INTEGER AS $$
DECLARE
  visitor_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_agent) INTO visitor_count
  FROM public.analytics
  WHERE profile_id = pid;
  
  RETURN visitor_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
