import ustaPhoto from '@/assets/avto-vakum-usta-qarshi.webp';
import { localeAlternates } from '@/i18n/alternates';
import {
  canonicalImageUrl,
  cardImageAlt,
  cardsMatchingKeywords,
  getCards,
  type BeforeAfterCard,
} from '@/lib/cards';
import { services } from '@/lib/services';
import { serializeSitemap, type SitemapEntry, type SitemapImage } from '@/lib/sitemap-xml';
import { site } from '@/lib/site';

/**
 * This is a route handler rather than the `sitemap.ts` metadata convention
 * because Next's built-in serializer emits `xhtml:link`/`image:image` before
 * `lastmod`, which the sitemaps.org schema rejects, and escapes nothing — see
 * the header comment in `src/lib/sitemap-xml.ts` for the details.
 *
 * `/sitemap.xml` keeps working without a trailing slash despite
 * `trailingSlash: true`: paths carrying a file extension are exempt from that
 * redirect (unlike extensionless metadata routes such as `/opengraph-image`).
 * That matters — it is the URL already submitted to Search Console.
 */
export const dynamic = 'force-static';

// The `images` lists depend on live Supabase data, so this is revalidated on
// the same hour cadence as the page itself (see `src/app/[locale]/page.tsx`).
export const revalidate = 3600;

function absoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${site.url}${url}`;
}

/**
 * `<image:image>` entries for a set of cards, in card order, before-then-after.
 *
 * The canonical (indexable) URL, never the raw Supabase one — see
 * `canonicalImageUrl` in `src/lib/cards.ts` for why. Captions reuse the same
 * text as the on-page `alt`, so the two never describe a photo differently.
 */
function galleryImages(cards: BeforeAfterCard[]): SitemapImage[] {
  const images: SitemapImage[] = [];
  for (const card of cards) {
    if (card.before_image_url) {
      images.push({
        loc: canonicalImageUrl(card.before_image_url),
        caption: cardImageAlt(card, 'oldin', card.before_label),
      });
    }
    if (card.after_image_url) {
      images.push({
        loc: canonicalImageUrl(card.after_image_url),
        caption: cardImageAlt(card, 'keyin', card.after_label),
      });
    }
  }
  return images;
}

async function buildEntries(): Promise<SitemapEntry[]> {
  const cards = await getCards();
  const lastModified = new Date();

  const home: SitemapEntry = {
    loc: `${site.url}/`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: localeAlternates('/'),
    images: [
      { loc: absoluteUrl(ustaPhoto.src), caption: `Avto vakum ustasi — ${site.city}` },
      // Trailing slash: this route 308-redirects without it (extensionless
      // metadata routes aren't exempted from `trailingSlash: true`).
      { loc: `${site.url}/opengraph-image/`, caption: site.nameFull },
      ...galleryImages(cards),
    ],
  };

  const servicePages = services.map((service): SitemapEntry => {
    const path = `/xizmatlar/${service.slug}/`;
    // A photo listed here is also listed under `/` — that is correct, and not
    // a duplicate: the image extension associates each image with every page
    // it actually appears on, and these cards render on both.
    const images = galleryImages(cardsMatchingKeywords(cards, service.keywords));

    return {
      loc: `${site.url}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: localeAlternates(path),
      ...(images.length > 0 ? { images } : {}),
    };
  });

  return [home, ...servicePages];
}

export async function GET(): Promise<Response> {
  const xml = serializeSitemap(await buildEntries());

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
