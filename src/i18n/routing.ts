import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['uz', 'ru', 'en'],
  defaultLocale: 'uz',
  localePrefix: 'as-needed',
  // Without this, next-intl picks a first-time visitor's locale from their
  // browser's Accept-Language header instead of always using defaultLocale —
  // Uzbek is the target market regardless of what language the visitor's
  // browser is set to.
  localeDetection: false,
});
