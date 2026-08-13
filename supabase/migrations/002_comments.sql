-- =============================================================================
-- 002_comments.sql
--
-- Creates everything the public contact form needs:
--   1. the `comments` table
--   2. Row Level Security: anon may INSERT only, nothing else
--
-- -----------------------------------------------------------------------------
-- HOW TO RUN THIS FILE — pick either option
-- -----------------------------------------------------------------------------
--
-- OPTION A — Supabase Dashboard (easiest, no tooling needed)
--   1. Open your project at https://supabase.com/dashboard
--   2. Left sidebar -> SQL Editor -> "New query"
--   3. Paste this entire file, press "Run"
--   4. Verify: Table Editor -> `comments` should exist and be empty.
--
-- OPTION B — Supabase CLI (keeps migrations versioned in git)
--   1. npm install -g supabase          # or: brew install supabase/tap/supabase
--   2. supabase login
--   3. supabase link --project-ref <your-project-ref>
--         (the ref is the subdomain in your project URL:
--          https://<project-ref>.supabase.co)
--   4. supabase db push
--      The CLI picks up every file in supabase/migrations/ in filename order,
--      so this one runs as migration 002, after 001_before_after_cards.sql.
--
-- This script is idempotent: running it twice will not error.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Extension
-- -----------------------------------------------------------------------------
-- Already enabled by 001_before_after_cards.sql on this project; repeated here
-- so this file also works standalone on a fresh database.
create extension if not exists pgcrypto;


-- -----------------------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  phone      text        not null,
  message    text        not null,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

comment on table public.comments is
  'Public contact-form submissions. Insert-only from the browser (anon key); read/updated/deleted only from /admin.';
comment on column public.comments.is_read is
  'Flipped to true by an admin Server Action once the submission has been seen.';

-- The admin list always reads "order by created_at desc" (newest first),
-- paginated with a "load more" cursor on the same column.
create index if not exists comments_created_at_idx
  on public.comments (created_at desc);


-- -----------------------------------------------------------------------------
-- 2. Row Level Security
-- -----------------------------------------------------------------------------
-- Insert-only for the public site — anyone can submit the form, nobody can read
-- someone else's submission back with the anon key. There is deliberately NO
-- select/update/delete policy: every read and mutation from /admin goes through
-- a server-side Server Action that has already verified the admin session and
-- uses the service role key (which bypasses RLS), exactly like
-- `before_after_cards` in 001_before_after_cards.sql.
alter table public.comments enable row level security;

drop policy if exists "Public insert access" on public.comments;
create policy "Public insert access"
  on public.comments
  for insert
  to anon
  with check (true);


-- =============================================================================
-- Verify (optional) — should return 0 rows on a fresh table, and confirm RLS
-- is on with exactly one policy
-- =============================================================================
-- select count(*) from public.comments;
-- select policyname, cmd, roles from pg_policies where tablename = 'comments';
