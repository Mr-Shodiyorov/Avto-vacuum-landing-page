import 'server-only';

import { supabaseRead } from '@/lib/supabase';

/** One row of `before_after_cards`. Mirrors supabase/migrations/001_*.sql. */
export interface BeforeAfterCard {
  id: string;
  title: string;
  before_label: string;
  after_label: string;
  before_image_url: string | null;
  after_image_url: string | null;
  meta: string;
  sort_order: number;
  created_at: string;
}

const COLUMNS =
  'id, title, before_label, after_label, before_image_url, after_image_url, meta, sort_order, created_at';

/**
 * Every card, in display order.
 *
 * Never throws. A landing page that 500s because the database blinked is worse
 * than one missing its gallery, so a failure degrades to an empty section and
 * leaves a line in the build/server log.
 */
export async function getCards(): Promise<BeforeAfterCard[]> {
  try {
    const { data, error } = await supabaseRead()
      .from('before_after_cards')
      .select(COLUMNS)
      // `created_at` breaks ties so the order is stable when sort_order repeats.
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []) as BeforeAfterCard[];
  } catch (error) {
    console.error('[before_after_cards] read failed:', error);
    return [];
  }
}
