import { routing } from '@/i18n/routing';
import { site } from '@/lib/site';

/**
 * Absolute URL for `path` (e.g. `/` or `/xizmatlar/keramika/`) in `locale`.
 * The default locale (`uz`) is unprefixed per `routing`'s `as-needed`
 * strategy — every other locale gets a `/<locale>` prefix.
 */
export function localizedUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${site.url}${prefix}${path}`;
}

/**
 * `alternates.languages` map for `generateMetadata`, covering every locale
 * plus `x-default` (pointing at the unprefixed Uzbek URL — still the primary
 * target market and canonical version). Feed straight into `Metadata.alternates`.
 */
export function localeAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages['x-default'] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

/** Open Graph locale codes, e.g. `og:locale`. */
export const ogLocale: Record<string, string> = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US',
};
