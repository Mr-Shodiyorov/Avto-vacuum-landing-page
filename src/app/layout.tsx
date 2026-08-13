import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import '@/styles/global.css';

import Motion from '@/components/Motion';
import Preloader from '@/components/Preloader';
import { site } from '@/lib/site';

/**
 * Fonts are self-hosted through `next/font` rather than imported as
 * `@fontsource` stylesheets.
 *
 * The @fontsource route hid the font files one round-trip deeper than they
 * needed to be: the browser had to fetch and parse the CSS bundle before it
 * could even discover the @font-face URLs. `next/font` emits the @font-face
 * inline and a `<link rel="preload">` in the initial HTML, so the download
 * starts immediately — worth a whole RTT on a slow mobile connection.
 *
 * Only the heading face is preloaded. Preloading all four (~95KB) would have
 * them competing with the hero image, which is the LCP element; the body text
 * swaps in a beat later instead, which nobody notices.
 */
const manrope = localFont({
  src: '../assets/fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800', // single variable file covers every weight used
  display: 'swap',
  variable: '--font-manrope',
});

const plexSans = localFont({
  src: [
    { path: '../assets/fonts/ibm-plex-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-plex-sans',
});

const title = 'Avto Vakum — Qarshida 24/7 avto vakuum, palirovka va keramika';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: {
    canonical: '/',
  },
  // TODO: add `images: ['/og-image.jpg']` once a real 1200×630 share image exists.
  openGraph: {
    type: 'website',
    siteName: site.nameFull,
    title,
    description: site.description,
    url: '/',
    locale: 'uz_UZ',
  },
  twitter: {
    card: 'summary',
    title,
    description: site.description,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b4a8f',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: site.nameFull,
  // TODO: add `image: `${site.url}/og-image.jpg`` once real photography/OG image is available.
  telephone: site.phones.map((p) => p.href.replace('tel:', '')),
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    addressLocality: site.city,
    addressCountry: 'UZ',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: [site.instagram.url, site.telegram.url],
  url: site.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script below adds `class="js"` to this element before React
    // hydrates, so the server HTML and the live DOM are *meant* to differ here.
    // Without this, React reports it as a hydration error. It only applies to
    // this element's own attributes — mismatches in children are still caught.
    <html
      lang="uz"
      className={`${manrope.variable} ${plexSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Marks JS as available before first paint so scroll-reveal targets start
            hidden only when something can actually reveal them. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        {/* First in the body so its markup is parsed and painted before any
            page content — the overlay is up on the very first frame. */}
        <Preloader />
        <a className="skip-link" href="#main">
          Asosiy kontentga o&apos;tish
        </a>
        {children}
        <Motion />
      </body>
    </html>
  );
}
