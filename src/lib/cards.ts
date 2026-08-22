import 'server-only';

import { supabaseRead } from '@/lib/supabase';
import { site } from '@/lib/site';

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

/** Width/quality used for every SEO-facing reference to a gallery photo (sitemap
 * `<image:loc>`, JSON-LD `ImageObject.contentUrl`) — one fixed pair so each photo
 * has a single canonical URL there, rather than the several width variants
 * `<WorkImage>`'s responsive `srcset` requests for on-screen display. 1920/75
 * are Next's own defaults (`images.deviceSizes` includes 1920; unset `quality`
 * on `<Image>` is 75), so this reuses a rendition the optimizer's cache is
 * already warm for instead of minting a new one. */
const CANONICAL_IMAGE_WIDTH = 1920;
const CANONICAL_IMAGE_QUALITY = 75;

/**
 * Same-origin, indexable URL for a photo stored in Supabase Storage.
 *
 * Supabase's own Storage responses carry `X-Robots-Tag: none` on every public
 * object (confirmed against this project's bucket directly) — search engines
 * are told outright not to index the raw `*.supabase.co/storage/...` URL, no
 * matter what a sitemap or structured-data entry says. `next/image`'s built-in
 * optimizer, reached through our own domain, carries no such header and is
 * already what real visitors load (see the `srcset`/`src` `<WorkImage>`
 * renders) — so every surface meant for search engines (sitemap `images`,
 * `ImageObject.contentUrl`/`url`) must point here instead of at `url` directly.
 */
export function canonicalImageUrl(url: string): string {
  const params = new URLSearchParams({
    url,
    w: String(CANONICAL_IMAGE_WIDTH),
    q: String(CANONICAL_IMAGE_QUALITY),
  });
  // Trailing slash: like `/opengraph-image/` elsewhere in this codebase, this
  // route 308-redirects without it — this site's `trailingSlash: true` isn't
  // limited to page routes, and a sitemap/schema URL should resolve directly
  // rather than send every crawler through a redirect hop first.
  return `${site.url}/_next/image/?${params.toString()}`;
}
