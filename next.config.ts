import type { NextConfig } from 'next';

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
  },
  trailingSlash: true,
};

export default nextConfig;
