/**
 * Base URL used for `metadataBase`, canonical/hreflang tags, JSON-LD, the
 * sitemap, and robots.txt. Only read server-side (see the `site.url`
 * consumers — all in generateMetadata/JSON-LD/sitemap.ts/robots.ts).
 *
 * - `NEXT_PUBLIC_SITE_URL` set (any environment) → used as-is. Set this in
 *   Vercel's environment variables to the real production domain.
 * - Unset in development → `http://localhost:<PORT>`, so canonical/hreflang
 *   self-reference the dev server instead of production — otherwise a local
 *   Lighthouse run flags a cross-origin canonical mismatch (the canonical
 *   tag pointing at avtovakum.uz while the page under test is localhost).
 * - Unset in production → falls back to the real domain rather than ever
 *   shipping a localhost URL in metadata, but warns loudly so a missing env
 *   var doesn't go unnoticed.
 */
function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  if (process.env.NODE_ENV !== 'production') {
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }

  console.warn(
    '[site] NEXT_PUBLIC_SITE_URL is not set in production — falling back to ' +
      'https://www.avtovakum.uz. Set it in your deployment environment.',
  );
  return 'https://www.avtovakum.uz';
}

export const site = {
  name: 'Avto Vakum',
  nameFull: 'Avto Vakum Servis',
  /**
   * Real-world spellings customers use for this business, for the
   * LocalBusiness schema's `alternateName`. Structured data is the correct
   * place to declare alternate spellings — it lets search engines match the
   * run-together and English-transliterated forms to this entity without
   * anyone having to write those spellings into visible body copy.
   */
  alternateNames: ['Avtovakum', 'Avto Vakuum Servis', 'Auto Vakum Qarshi'],
  city: 'Qarshi',
  description:
    "Avto vakum Qarshida — 24/7 avtomobil tozalash, palirovka va keramika. Navbatsiz qabul qilamiz, hoziroq qo'ng'iroq qiling!",
  url: resolveSiteUrl(),
  phones: [
    { display: '+998 (94) 952-07-07', href: 'tel:+998949520707' },
    { display: '+998 (90) 615-67-76', href: 'tel:+998906156776' },
  ],
  instagram: {
    handle: '@avto_vakum_senter',
    // www + trailing slash: Instagram's own canonical URL for the profile,
    // and what `sameAs` in the LocalBusiness schema should match exactly.
    url: 'https://www.instagram.com/avto_vakum_senter/',
  },
  telegram: {
    handle: '@avto_vakum_senter',
    url: 'https://t.me/avto_vakum_senter',
  },
  address: "Qarshi sh., Obodonlashtirish ro'parasi, svetofor oldidagi chorraha",
  hours: "Har kuni, 24 soat — dam olish kunlarisiz",
} as const;

/**
 * Stable JSON-LD `@id` for the LocalBusiness node in `src/app/layout.tsx`.
 * Every `Service` schema on a `/xizmatlar/[slug]` page points its `provider`
 * at this same URI so Google resolves them as the same business entity
 * instead of four disconnected ones.
 */
export const businessId = `${site.url}/#business`;

/**
 * Physical location of the service.
 *
 * `lat`/`lng` are the source of truth — every map link below is built from
 * them, so the pin can never drift away from the address shown on the page.
 * Note Yandex takes its coordinates as lng,lat, the reverse of Google.
 */
const lat = 38.814076;
const lng = 65.799051;

export const location = {
  lat,
  lng,
  /** Full directions, as given by the owner. */
  directions:
    "Qarshi shahar, Shahar obodonlashtirish ro'parasida, svetofor oldidagi chorrahada joylashgan.",
  maps: {
    google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    yandex: `https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`,
    /** Rendered as a plain image-like embed; no API key required. */
    embed: `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
  },
} as const;

// TODO: replace with the real craftsman's name once provided.
export const master = {
  title: 'Bosh usta',
  experienceYears: 7,
  experienceLabel: '7 yillik tajriba',
  bio: "Professional kimyo va uskunalar bilan ishlaydigan bosh usta — har bir avtomobilga alohida yondashadi.",
} as const;

// Leading `/` so these still resolve correctly from a route other than the
// homepage (e.g. a `/xizmatlar/[slug]` page) — a bare `#hash` only scrolls
// the current page and finds nothing there, since every section these point
// to only exists on `/`. Labels live in messages/<locale>.json under
// `nav.<key>`; `href` goes through the locale-aware `Link` from
// `@/i18n/navigation`, which prefixes it for the current locale.
export const navLinks = [
  { key: 'works', href: '/#ishlarimiz' },
  { key: 'services', href: '/#xizmatlar' },
  { key: 'whyUs', href: '/#nega-biz' },
  { key: 'contact', href: '/#aloqa' },
  { key: 'location', href: '/#manzil' },
] as const;
