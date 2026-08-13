-- =============================================================================
-- 001_before_after_cards.sql
--
-- Creates everything the "Oldin va keyin" (before/after) section needs:
--   1. the `before_after_cards` table
--   2. Row Level Security: anon may SELECT, nothing else
--   3. the `before-after-images` storage bucket (public read)
--   4. an OPTIONAL seed section with the 3 current cards
--
-- -----------------------------------------------------------------------------
-- HOW TO RUN THIS FILE — pick either option
-- -----------------------------------------------------------------------------
--
-- OPTION A — Supabase Dashboard (easiest, no tooling needed)
--   1. Open your project at https://supabase.com/dashboard
--   2. Left sidebar -> SQL Editor -> "New query"
--   3. Paste this entire file, press "Run"
--   4. Verify: Table Editor -> `before_after_cards` should list 3 rows
--      and Storage should list a `before-after-images` bucket.
--
-- OPTION B — Supabase CLI (keeps migrations versioned in git)
--   1. npm install -g supabase          # or: brew install supabase/tap/supabase
--   2. supabase login
--   3. supabase link --project-ref <your-project-ref>
--         (the ref is the subdomain in your project URL:
--          https://<project-ref>.supabase.co)
--   4. supabase db push
--      The CLI picks up every file in supabase/migrations/ in filename order,
--      so this one runs as migration 001.
--
-- This script is idempotent: running it twice will not error and will not
-- duplicate the seed rows.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Extension
-- -----------------------------------------------------------------------------
-- gen_random_uuid() is built into PostgreSQL 13+, and Supabase enables pgcrypto
-- by default. This line is here only so the file also works on older setups.
create extension if not exists pgcrypto;


-- -----------------------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------------------
create table if not exists public.before_after_cards (
  id               uuid primary key default gen_random_uuid(),
  title            text        not null default '',
  before_label     text        not null default '',
  after_label      text        not null default '',
  before_image_url text,                              -- null => show the striped placeholder
  after_image_url  text,                              -- null => show the striped placeholder
  meta             text        not null default '',
  sort_order       int         not null default 0,
  created_at       timestamptz not null default now()
);

comment on table public.before_after_cards is
  'Cards rendered by the "Oldin va keyin" section. Managed from /admin.';
comment on column public.before_after_cards.sort_order is
  'Ascending display order on the public page. Ties broken by created_at.';
comment on column public.before_after_cards.before_image_url is
  'Public URL in the before-after-images bucket. NULL renders a placeholder.';

-- The public page always reads "order by sort_order, created_at".
create index if not exists before_after_cards_sort_order_idx
  on public.before_after_cards (sort_order, created_at);


-- -----------------------------------------------------------------------------
-- 2. Row Level Security
-- -----------------------------------------------------------------------------
-- Read-only for the public site. There is deliberately NO insert/update/delete
-- policy: every write goes through a server-side Server Action that has already
-- verified the admin session and uses the service role key (which bypasses RLS).
-- So even if the anon key leaks — and it is public by design, it ships in the
-- browser bundle — nobody can modify these rows.
alter table public.before_after_cards enable row level security;

drop policy if exists "Public read access" on public.before_after_cards;
create policy "Public read access"
  on public.before_after_cards
  for select
  to anon, authenticated
  using (true);


-- -----------------------------------------------------------------------------
-- 3. Storage bucket
-- -----------------------------------------------------------------------------
-- APPROACH USED: plain SQL insert into storage.buckets.
--
-- Why this way: `storage.buckets` is an ordinary table, and inserting into it is
-- exactly what the Dashboard's "New bucket" button does. It runs reliably from
-- both the SQL Editor and `supabase db push`.
--
-- What is deliberately NOT scripted here: RLS policies on `storage.objects`.
-- That table is owned by the `supabase_storage_admin` role, so `create policy`
-- against it fails with "must be owner of table objects" on some projects. It
-- is also unnecessary here:
--   * reads  - `public = true` below makes every object in this bucket readable
--              at /storage/v1/object/public/before-after-images/... with no
--              policy and no key at all.
--   * writes - only ever happen server-side with the service role key, which
--              bypasses RLS entirely.
-- So the bucket needs no policies. If you ever want browser-side uploads, add
-- the policies through Dashboard -> Storage -> Policies instead of SQL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'before-after-images',
  'before-after-images',
  true,                                                    -- public read
  5242880,                                                 -- 5 MB, matches the admin UI limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- =============================================================================
-- 4. SEED DATA — OPTIONAL
-- -----------------------------------------------------------------------------
-- Everything below this line is just your current 3 hard-coded cards, so the
-- page looks unchanged the moment it starts reading from the database.
--
-- SAFE TO DELETE this whole section if you would rather start empty, or if you
-- have already added your own cards through /admin.
--
-- Image URLs are intentionally NULL: the public section falls back to the
-- diagonal-stripe placeholder, and you upload the real photos from /admin.
--
-- `where not exists` keeps this from double-inserting if the file is re-run.
-- =============================================================================
insert into public.before_after_cards
  (title, before_label, after_label, meta, sort_order, before_image_url, after_image_url)
select *
from (values
  ('Salon vakuumi',        'iflos salon',   'toza salon',  'Cobalt · 45 daq', 1, null::text, null::text),
  ('Kuzov kassa prav',     'vmyatina',      'tekis kuzov', 'Malibu · 2 soat', 2, null,       null),
  ('Palirovka + keramika', 'xira bo''yoq',  'jilolangan',  'Tracker · 1 kun', 3, null,       null)
) as seed(title, before_label, after_label, meta, sort_order, before_image_url, after_image_url)
where not exists (select 1 from public.before_after_cards);


-- =============================================================================
-- Verify (optional) — should return the 3 seeded rows
-- =============================================================================
-- select title, before_label, after_label, meta, sort_order
-- from public.before_after_cards
-- order by sort_order, created_at;
