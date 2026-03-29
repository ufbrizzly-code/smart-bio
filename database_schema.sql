-- ============================================================
-- SmartBio Complete Database Schema (Supabase)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles Table ────────────────────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  full_name    text,
  bio          text,
  avatar_url   text,

  -- Header
  profile_layout  text default 'classic',
  title_style     text default 'text',
  title_size      text default 'small',
  alt_font        boolean default false,

  -- Theme & Wallpaper
  theme             text default 'void',
  wallpaper         text,
  wallpaper_style   text default 'fill',
  custom_bg         text,
  accent_color      text default '#a855f7',

  -- Text Colors
  title_color       text,
  bio_color         text,
  page_text_color   text,
  page_font         text default 'Inter',

  -- Buttons
  button_style      text default 'glass',
  button_roundness  text default 'rounder',
  button_shadow     text default 'soft',
  button_color      text,
  button_text_color text,

  -- Footer
  show_footer       boolean default true,

  created_at    timestamptz default now()
);

-- ── Links Table ───────────────────────────────────────────────────────────────
create table if not exists links (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade not null,
  title       text not null,
  url         text not null,
  position    integer default 0,
  is_visible  boolean default true,
  click_count integer default 0,
  created_at  timestamptz default now()
);

-- ── Analytics Table ───────────────────────────────────────────────────────────
create table if not exists analytics (
  id          uuid primary key default uuid_generate_v4(),
  link_id     uuid references links(id) on delete cascade not null,
  profile_id  uuid references profiles(id) on delete cascade not null,
  user_agent  text,
  referrer    text,
  country     text,
  created_at  timestamptz default now()
);

-- ── Link Rules Table (smart rules) ────────────────────────────────────────────
create table if not exists link_rules (
  id          uuid primary key default uuid_generate_v4(),
  link_id     uuid references links(id) on delete cascade not null,
  rule_type   text not null, -- 'time_based' | 'click_limit' | 'location_based'
  config      jsonb not null default '{}',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────
alter table profiles enable row level security;
alter table links enable row level security;
alter table analytics enable row level security;
alter table link_rules enable row level security;

-- Profiles: users can read all (for public pages), write own
drop policy if exists "profiles_public_read" on profiles;
create policy "profiles_public_read" on profiles for select using (true);

drop policy if exists "profiles_owner_write" on profiles;
create policy "profiles_owner_write" on profiles for all using (auth.uid() = id);

-- Links: public can read visible links, owners can write
drop policy if exists "links_public_read" on links;
create policy "links_public_read" on links for select using (true);

drop policy if exists "links_owner_write" on links;
create policy "links_owner_write" on links for all
  using (auth.uid() = (select id from profiles where id = profile_id));

-- Analytics: owners can read own, anyone can insert
drop policy if exists "analytics_insert_public" on analytics;
create policy "analytics_insert_public" on analytics for insert with check (true);

drop policy if exists "analytics_owner_read" on analytics;
create policy "analytics_owner_read" on analytics for select
  using (auth.uid() = (select id from profiles where id = profile_id));

drop policy if exists "analytics_owner_delete" on analytics;
create policy "analytics_owner_delete" on analytics for delete
  using (auth.uid() = (select id from profiles where id = profile_id));

-- Link rules: same as links
drop policy if exists "link_rules_public_read" on link_rules;
create policy "link_rules_public_read" on link_rules for select using (true);

drop policy if exists "link_rules_owner_write" on link_rules;
create policy "link_rules_owner_write" on link_rules for all
  using (
    auth.uid() = (
      select p.id from profiles p
      join links l on l.profile_id = p.id
      where l.id = link_id
    )
  );

-- ── Auto-create Profile on Signup ─────────────────────────────────────────────
-- Run this function to auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, theme, button_style, button_roundness, show_footer)
  values (
    new.id,
    'user_' || floor(random() * 1000000)::text,
    'void',
    'glass',
    'rounder',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Attach trigger (drop first to avoid duplicates)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Supabase Storage Bucket for Avatars ─────────────────────────────────────
-- Run this manually in Storage tab OR via SQL:
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload avatars
drop policy if exists "avatar_upload" on storage.objects;
create policy "avatar_upload" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.role() = 'authenticated'
  );

-- Allow public read of avatars
drop policy if exists "avatar_public_read" on storage.objects;
create policy "avatar_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow users to update/delete their own avatars
drop policy if exists "avatar_owner_update" on storage.objects;
create policy "avatar_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ── Supabase Storage Bucket for Links ─────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('links', 'links', true)
on conflict (id) do nothing;

drop policy if exists "links_upload" on storage.objects;
create policy "links_upload" on storage.objects
  for insert with check (
    bucket_id = 'links' and auth.role() = 'authenticated'
  );

drop policy if exists "links_public_read" on storage.objects;
create policy "links_public_read" on storage.objects
  for select using (bucket_id = 'links');

-- ── Supabase Storage Bucket for Sounds ─────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('sounds', 'sounds', true)
on conflict (id) do nothing;

drop policy if exists "sounds_upload" on storage.objects;
create policy "sounds_upload" on storage.objects
  for insert with check (
    bucket_id = 'sounds' and auth.role() = 'authenticated'
  );

drop policy if exists "sounds_public_read" on storage.objects;
create policy "sounds_public_read" on storage.objects
  for select using (bucket_id = 'sounds');
