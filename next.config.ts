import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // NOTE: this used to be `output: 'export'`. A static export has no server at
  // runtime, so it cannot read a session cookie, run `proxy.ts`, or execute the
  // Server Actions behind /admin. The site now builds as a regular Next.js app.
  // The landing page is still prerendered and CDN-served — see the `revalidate`
  // export in `src/app/page.tsx` — so visitors get the same static-speed HTML.
  images: {
    remotePatterns: [
      {
        // Supabase Storage public objects, e.g.
        // https://<project-ref>.supabase.co/storage/v1/object/public/before-after-images/<file>
        // `*` matches exactly one subdomain segment (the project ref).
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
        // `search` is deliberately unset: the pathname above already pins this
        // to public bucket reads, and leaving it open keeps cache-busting query
        // strings (?t=...) working.
      },
    ],
    // Every upload gets a fresh random-suffixed path (see `createUploadTicket`
    // in src/app/admin/actions.ts) and edits delete the old object rather than
    // overwriting it in place, so a given optimized-image URL's bytes never
    // change — safe to cache for a year. This also matters for indexing:
    // Supabase Storage's own object responses carry `Cache-Control: no-cache`,
    // and per Next's docs the *larger* of that upstream header and this value
    // wins, so raising this is what actually controls how long Google (and
    // everyone else) can cache the optimized copy this app serves.
    minimumCacheTTL: 31536000,
    // Supabase's raw storage responses also carry `X-Robots-Tag: none`,
    // which blocks Googlebot-Image from indexing the direct URL outright.
    // `next/image`'s own optimizer output (same origin, no such header) is
    // deliberately used instead wherever an image needs to be indexable —
    // see `canonicalImageUrl` in `src/lib/cards.ts`. Serving it `inline`
    // rather than the v15 default `attachment` matters for that: only
    // jpg/png/webp ever reach this bucket (enforced in `src/lib/storage.ts`
    // and the bucket's own `allowed_mime_types`), so there's no SVG-script
    // risk that `attachment` guards against.
    contentDispositionType: 'inline',
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
