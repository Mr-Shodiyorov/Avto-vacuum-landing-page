import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from '@/i18n/routing';

// `requestLocale`/`setRequestLocale` are marked deprecated in next-intl in
// favor of Next 16's `next/root-params`, but remain fully supported — this
// project keeps the battle-tested pattern rather than an unverified rewrite
// onto a brand-new API neither this codebase nor training data has exercised.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
