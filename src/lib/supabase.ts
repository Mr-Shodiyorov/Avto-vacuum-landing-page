import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Two clients, two privilege levels.
 *
 * - `supabaseRead` uses the anon key. RLS on `before_after_cards` allows it to
 *   SELECT and nothing else, so the worst case for a leak is a public read of
 *   already-public marketing content.
 * - `supabaseAdmin` uses the service role key, which bypasses RLS entirely. It
 *   is only ever called from Server Actions that have already verified the
 *   admin session.
 *
 * The `server-only` import above turns any accidental import from a Client
 * Component into a build error rather than a leaked key in the JS bundle.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to .env.local locally, ` +
        `or in Vercel -> Project Settings -> Environment Variables.`,
    );
  }
  return value;
}

// No session persistence: this runs per-request on a server, there is no browser
// storage to persist into and no token to refresh.
const serverClientOptions = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

let readClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/** Anon, read-only. Used by the public landing page. */
export function supabaseRead(): SupabaseClient {
  readClient ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serverClientOptions,
  );
  return readClient;
}

/** Service role — bypasses RLS. Only call after verifying the admin session. */
export function supabaseAdmin(): SupabaseClient {
  adminClient ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    serverClientOptions,
  );
  return adminClient;
}

/** True when Supabase credentials are present at all. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
