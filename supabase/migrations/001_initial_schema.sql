-- Auliya Calendar & Sunni Companion — PostgreSQL / Supabase Migration 001
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard) to provision
-- multi-device auth profiles, RBAC permissions, Auliya/Urs CMS, Barsi Khatm boards,
-- platform config, and SHA-256 chained audit logs with Row-Level Security (RLS).

create extension if not exists "pgcrypto";

-- 1. User Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) >= 2),
  email text not null unique,
  role text not null default 'member' check (role in ('super_admin', 'editor', 'creator', 'member')),
  title text not null default 'Sanctuary Member',
  city text not null default 'Global',
  avatar_color text not null default '#A855F7',
  status text not null default 'active' check (status in ('active', 'suspended')),
  xp integer not null default 100 check (xp >= 0),
  preferred_lang text not null default 'en',
  preferred_theme text not null default 'indigo-night',
  progress_jsonb jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

-- Helper: look up current authenticated user's RBAC role
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and status = 'active' limit 1;
$$;

-- Trigger: auto-create profile when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'requested_role', 'member');
  if requested_role not in ('member', 'creator') then
    requested_role := 'member';
  end if;

  insert into public.profiles (id, name, email, role, title, city)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    requested_role,
    case when requested_role = 'creator' then 'Community Archive Creator' else 'Sanctuary Member' end,
    coalesce(nullif(trim(new.raw_user_meta_data->>'city'), ''), 'Global')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Auliya Allah Directory & Tazkirah CMS
create table if not exists public.auliya_records (
  id text primary key,
  slug text not null unique,
  data_jsonb jsonb not null,
  status text not null default 'Draft' check (status in ('Draft', 'Scholarly Verification', 'Published')),
  review_notes text,
  created_by_user_id text not null,
  created_by_name text not null,
  verified_by_name text,
  updated_at timestamptz not null default now()
);

-- 3. Urs & Sacred Hijri Calendar Events
create table if not exists public.urs_events (
  id text primary key,
  month integer not null check (month between 1 and 12),
  day integer not null check (day between 1 and 30),
  duration_days integer not null default 1,
  title text not null,
  urdu_title text not null default '',
  subtitle text not null default '',
  city text not null default 'Global',
  country text not null default 'Ummah',
  silsila text,
  auliya_id text,
  type text not null default 'urs' check (type in ('urs', 'sacred', 'fasting')),
  recommended_wird text not null default '',
  featured boolean not null default false,
  status text not null default 'Scholarly Verification' check (status in ('Draft', 'Scholarly Verification', 'Published')),
  review_notes text,
  created_by_user_id text not null,
  created_by_name text not null,
  updated_at timestamptz not null default now()
);

-- 4. Barsi & 30-Para Khatm-e-Quran Memorials
create table if not exists public.barsi_records (
  id text primary key,
  owner_user_id text not null,
  owner_name text not null,
  person_name text not null,
  urdu_name text not null default '',
  relation text not null default 'Beloved Marhum / Marhuma',
  hijri_month integer not null check (hijri_month between 1 and 12),
  hijri_day integer not null check (hijri_day between 1 and 30),
  hijri_year integer,
  gregorian_death_date text,
  resting_place_city text not null default '',
  qabrastan_name text not null default '',
  memory_note text not null default '',
  favorite_wird text not null default '',
  visibility text not null default 'private' check (visibility in ('private', 'community')),
  khatm_paras jsonb not null default '{}'::jsonb,
  total_fatiha_count integer not null default 0,
  total_durood_count integer not null default 0,
  total_yasin_count integer not null default 0,
  gift_logs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Modular Platform Config (modules, zakat, gamification, settings)
create table if not exists public.platform_config (
  key text primary key check (key in ('modules', 'zakat', 'gamification', 'settings')),
  value_jsonb jsonb not null,
  updated_at timestamptz not null default now()
);

-- 6. Tamper-Evident Chained Audit Logs
create table if not exists public.audit_logs (
  id text primary key,
  timestamp timestamptz not null default now(),
  actor_id text not null,
  actor_name text not null,
  actor_role text not null,
  action text not null,
  target text not null,
  prev_hash text not null,
  hash text not null
);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.auliya_records enable row level security;
alter table public.urs_events enable row level security;
alter table public.barsi_records enable row level security;
alter table public.platform_config enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: users read/update own profile; super_admin & editor can view directory; super_admin updates roles
create policy "profiles_select_self_or_staff" on public.profiles
  for select using (
    auth.uid() = id
    or public.current_user_role() in ('super_admin', 'editor')
  );

create policy "profiles_update_self_safe" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and status = (select p.status from public.profiles p where p.id = auth.uid())
  );

create policy "profiles_super_admin_manage" on public.profiles
  for update using (public.current_user_role() = 'super_admin');

-- Auliya: public reads Published; creators/editors/admins read all; creators insert/edit own; editors/admins publish
create policy "auliya_select_published_or_staff" on public.auliya_records
  for select using (
    status = 'Published'
    or public.current_user_role() in ('super_admin', 'editor', 'creator')
  );

create policy "auliya_insert_contributors" on public.auliya_records
  for insert with check (
    public.current_user_role() in ('super_admin', 'editor', 'creator')
  );

create policy "auliya_update_rbac" on public.auliya_records
  for update using (
    public.current_user_role() in ('super_admin', 'editor')
    or (public.current_user_role() = 'creator' and created_by_user_id = auth.uid()::text)
  );

create policy "auliya_delete_admin" on public.auliya_records
  for delete using (public.current_user_role() = 'super_admin');

-- Urs Events: same editorial gate
create policy "urs_select_published_or_staff" on public.urs_events
  for select using (
    status = 'Published'
    or public.current_user_role() in ('super_admin', 'editor', 'creator')
  );

create policy "urs_insert_contributors" on public.urs_events
  for insert with check (
    public.current_user_role() in ('super_admin', 'editor', 'creator')
  );

create policy "urs_update_rbac" on public.urs_events
  for update using (
    public.current_user_role() in ('super_admin', 'editor')
    or (public.current_user_role() = 'creator' and created_by_user_id = auth.uid()::text)
  );

create policy "urs_delete_admin" on public.urs_events
  for delete using (public.current_user_role() = 'super_admin');

-- Barsi Records: public reads community; owners read/update/delete own; editors/admins moderate community
create policy "barsi_select_community_or_owner" on public.barsi_records
  for select using (
    visibility = 'community'
    or owner_user_id = auth.uid()::text
    or public.current_user_role() = 'super_admin'
  );

create policy "barsi_insert_authenticated" on public.barsi_records
  for insert with check (auth.uid() is not null);

create policy "barsi_update_owner_or_community_gift" on public.barsi_records
  for update using (
    visibility = 'community'
    or owner_user_id = auth.uid()::text
    or public.current_user_role() in ('super_admin', 'editor')
  );

create policy "barsi_delete_owner_or_admin" on public.barsi_records
  for delete using (
    owner_user_id = auth.uid()::text
    or public.current_user_role() in ('super_admin', 'editor')
  );

-- Platform Config: readable by everyone, writable by editor/super_admin
create policy "config_select_all" on public.platform_config
  for select using (true);

create policy "config_write_staff" on public.platform_config
  for all using (public.current_user_role() in ('super_admin', 'editor'));

-- Audit Logs: readable by contributors/editors/admins, appendable by authenticated users
create policy "audit_select_staff" on public.audit_logs
  for select using (public.current_user_role() in ('super_admin', 'editor', 'creator'));

create policy "audit_insert_authenticated" on public.audit_logs
  for insert with check (auth.uid() is not null);
