import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Geist } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '@/styles/global.css';

import Motion from '@/components/Motion';
import PhoneModal from '@/components/PhoneModal';
import Preloader from '@/components/Preloader';
import SupportModal from '@/components/SupportModal';
import { localeAlternates, ogLocale } from '@/i18n/alternates';
import { routing } from '@/i18n/routing';
import { businessId, location, site } from '@/lib/site';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const manrope = localFont({
  src: '../../assets/fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-manrope',
});

const plexSans = localFont({
  src: [
    { path: '../../assets/fonts/ibm-plex-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/ibm-plex-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/ibm-plex-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-plex-sans',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'seo' });
  const title = t('title');
  const description = t('description');
  const languages = localeAlternates('/');

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: languages[locale],
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: site.nameFull,
      title,
      description,
      url: languages[locale],
      locale: ogLocale[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b4a8f',
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale — see
  // https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
  setRequestLocale(locale);

  const t = await getTranslations('common');
  const tSeo = await getTranslations('seo');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': businessId,
    name: site.nameFull,
    alternateName: site.name,
    description: tSeo('description'),
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

  return (
    <html
      lang={locale}
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
        <NextIntlClientProvider>
          <Preloader />
          <a className="skip-link" href="#main">
            {t('skipLink')}
          </a>
          {children}
          <PhoneModal />
          <SupportModal />
          <Motion />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
