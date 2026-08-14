import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Geist } from "next/font/google";

import '@/styles/global.css';

import Motion from '@/components/Motion';
import PhoneModal from '@/components/PhoneModal';
import Preloader from '@/components/Preloader';
import SupportModal from '@/components/SupportModal';
import { businessId, location, site } from '@/lib/site';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const manrope = localFont({
  src: '../assets/fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
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

const title = 'Avto Vakum Qarshi — 24/7 avtomobil tozalash va detailing xizmati';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: site.nameFull,
    title,
    description: site.description,
    url: '/',
    locale: 'uz_UZ',
  },
  twitter: {
    card: 'summary_large_image',
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
  '@id': businessId,
  name: site.nameFull,
  alternateName: site.name,
  // Trailing slash matches this site's `trailingSlash: true` config — without
  // it, this route 308-redirects (extensionless metadata routes aren't
  // exempted the way sitemap.xml/robots.txt are), and structured-data image
  // URLs should resolve directly rather than through a redirect hop.
  image: `${site.url}/opengraph-image/`,
  telephone: site.phones.map((p) => p.href.replace('tel:', '')),
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    addressLocality: site.city,
    addressCountry: 'UZ',
  },
  areaServed: {
    '@type': 'City',
    name: site.city,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: location.lat,
    longitude: location.lng,
  },
  hasMap: location.maps.google,
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
    <html
      lang="uz"
      className={cn(manrope.variable, plexSans.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <Preloader />
        <a className="skip-link" href="#main">
          Asosiy kontentga o&apos;tish
        </a>
        {children}
        <PhoneModal />
        <SupportModal />
        <Motion />
      </body>
    </html>
  );
}
