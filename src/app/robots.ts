import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin panel is password-protected anyway; keeping it out of the
      // index means it never shows up in a search result either.
      disallow: '/admin/',
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
