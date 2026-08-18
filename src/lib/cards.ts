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

/**
 * Best-effort match for a service's dedicated page: cards whose `title`
 * contains one of that service's keywords (see `src/lib/services.ts`).
 *
 * There is no `service` column on this table, so this is a text match
 * against whatever admins typed in — not a guarantee. Callers should treat
 * an empty result as "no confidently-relevant photos yet" rather than fall
 * back to showing unrelated work under the wrong service's name.
 */
export function cardsMatchingKeywords(
  cards: BeforeAfterCard[],
  keywords: string[],
): BeforeAfterCard[] {
  return cards.filter((card) => {
    const haystack = card.title.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
  });
}

/**
 * Descriptive `<img alt>` / lightbox-caption text for one half of a card,
 * e.g. "Kuzov kassa prav — Malibu · 2 soat, oldin: vmyatina — avto vakum
 * markazi, Qarshi". Shared by the homepage gallery and the
 * `/xizmatlar/[slug]` galleries so the two never drift into different
 * alt-text conventions.
 *
 * The trailing clause says where the photo was taken, which is true of every
 * one of these images and is what image search needs in order to surface them
 * for local queries.
 */
export function cardImageAlt(
  card: BeforeAfterCard,
  state: 'oldin' | 'keyin',
  stateLabel: string,
): string {
  const context = card.meta ? `${card.title} — ${card.meta}` : card.title;
  return `${context}, ${state}: ${stateLabel} — avto vakum markazi, Qarshi`;
}
