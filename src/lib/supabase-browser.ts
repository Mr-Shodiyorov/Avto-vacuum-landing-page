import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client, anon key only.
 *
 * Used for exactly one thing: PUTting an image straight to Storage with a
 * short-lived signed upload token minted server-side (see `createUploadTicket`
 * in `src/app/admin/actions.ts`). The anon key is read-only under RLS and the
 * token is what authorizes the write, so nothing privileged reaches the browser.
 *
 * Note this file has no `server-only` import — unlike `src/lib/supabase.ts`,
 * which holds the service role key and must never be bundled for the client.
 */

let client: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return client;
}
