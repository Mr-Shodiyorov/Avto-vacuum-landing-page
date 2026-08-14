import type { MetadataRoute } from 'next';

import ustaPhoto from '@/assets/avto-vakum-usta-qarshi.webp';
import { localeAlternates } from '@/i18n/alternates';
import { cardsMatchingKeywords, getCards } from '@/lib/cards';
import { services } from '@/lib/services';
import { site } from '@/lib/site';

// The homepage's `images` list depends on live Supabase data, so this can no
// longer be `force-static` — it's revalidated on the same hour cadence as the
// page itself (see `src/app/page.tsx`).
export const revalidate = 3600;

function absoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${site.url}${url}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getCards();
  const galleryImages = cards
    .flatMap((card) => [card.before_image_url, card.after_image_url])
    .filter((url): url is string => Boolean(url));

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
        .filter((url): url is string => Boolean(url));
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
