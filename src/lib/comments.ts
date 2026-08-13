import 'server-only';

import { requireSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

/** One row of `comments`. Mirrors supabase/migrations/002_comments.sql. */
export interface Comment {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CommentsPage {
  comments: Comment[];
  hasMore: boolean;
}

const COLUMNS = 'id, name, phone, message, is_read, created_at';
export const COMMENTS_PAGE_SIZE = 20;

/**
 * Newest-first page of comments, admin-only.
 *
 * Unlike `getCards()`, this uses the service-role client: `comments` has no
 * anon select policy at all (see supabase/migrations/002_comments.sql), so
 * reading it always requires bypassing RLS. That makes the session check here,
 * not just the one in the calling page, the actual security boundary — same
 * defense-in-depth reasoning as the Server Actions in admin/actions.ts.
 *
 * `before` is the `created_at` of the last row already loaded — pass it to get
 * the next page.
 */
export async function getComments(before?: string): Promise<CommentsPage> {
  await requireSession();

  let query = supabaseAdmin()
    .from('comments')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
    .limit(COMMENTS_PAGE_SIZE + 1); // one extra row reveals whether more remain

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[comments] read failed:', error);
    return { comments: [], hasMore: false };
  }

  const rows = (data ?? []) as Comment[];
  const hasMore = rows.length > COMMENTS_PAGE_SIZE;
  return { comments: hasMore ? rows.slice(0, COMMENTS_PAGE_SIZE) : rows, hasMore };
}

/** Unread count, for the badge on the "Komentlar" tab. */
export async function getUnreadCommentCount(): Promise<number> {
  await requireSession();

  const { count, error } = await supabaseAdmin()
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) {
    console.error('[comments] unread count failed:', error);
    return 0;
  }
  return count ?? 0;
}
