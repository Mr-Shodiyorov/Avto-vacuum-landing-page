import type { MetadataRoute } from 'next';

import ustaPhoto from '@/assets/avto-vakum-usta-qarshi.webp';
import { localeAlternates } from '@/i18n/alternates';
import { canonicalImageUrl, cardsMatchingKeywords, getCards } from '@/lib/cards';
import { services } from '@/lib/services';
import { site } from '@/lib/site';

// The homepage's `images` list depends on live Supabase data, so this can no
// longer be `force-static` — it's revalidated on the same hour cadence as the
// page itself (see `src/app/page.tsx`).
export const revalidate = 3600;

function absoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${site.url}${url}`;
}

/**
 * Next's built-in sitemap serializer drops `images` entries straight into
 * `<image:loc>...</image:loc>` with no XML-escaping at all (see
 * `resolveSitemap` in
 * node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js)
 * — it's only ever been exercised with plain page URLs before, which never
 * contain a raw `&`. `canonicalImageUrl` builds a `/_next/image/?url=...&w=...`
 * URL, whose `&` param separators are otherwise well-formed XML entity refs
 * gone wrong ("EntityRef: expecting ';'" is exactly this). Must escape here,
 * not inside `canonicalImageUrl` itself — that same value also goes straight
 * into `JSON.stringify` for the `ImageObject` schema, where an `&amp;` would
 * corrupt the actual URL.
 */
function xmlSafeImage(url: string): string {
  return url.replace(/&/g, '&amp;');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getCards();
  // The canonical (indexable) URL, never the raw Supabase one — see
  // `canonicalImageUrl` in `src/lib/cards.ts` for why.
  const galleryImages = cards
    .flatMap((card) => [card.before_image_url, card.after_image_url])
    .filter((url): url is string => Boolean(url))
    .map(canonicalImageUrl)
    .map(xmlSafeImage);

  const homeImages = [
    absoluteUrl(ustaPhoto.src),
    // Trailing slash: this route 308-redirects without it (extensionless
    // metadata routes aren't exempted from `trailingSlash: true`).
    `${site.url}/opengraph-image/`,
    ...galleryImages,
  ];

  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: homeImages,
      alternates: { languages: localeAlternates('/') },
    },
    ...services.map((service) => {
      const serviceImages = cardsMatchingKeywords(cards, service.keywords)
        .flatMap((card) => [card.before_image_url, card.after_image_url])
        .filter((url): url is string => Boolean(url))
        .map(canonicalImageUrl)
        .map(xmlSafeImage);
      const path = `/xizmatlar/${service.slug}/`;

      return {
        url: `${site.url}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: { languages: localeAlternates(path) },
        ...(serviceImages.length > 0 ? { images: serviceImages } : {}),
      };
    }),
  ];
}
