'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

import './language-switcher.css';

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  uz: 'UZB',
  ru: 'RUS',
  en: 'ENG',
};

const localeNames: Record<(typeof routing.locales)[number], string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

/**
 * Preserves the current page when switching locale (e.g. `/xizmatlar/keramika`
 * -> `/ru/xizmatlar/keramika`, not back to the homepage) — `pathname` here is
 * the locale-stripped path next-intl's `usePathname` resolves, and the `Link`
 * `locale` prop re-prefixes it for the target language.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const activeLocale = useLocale();

  return (
    <div className={`lang-switch ${className ?? ''}`} role="group" aria-label={t('languageSwitcherLabel')}>
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            className={`lang-switch__item ${isActive ? 'lang-switch__item--active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            title={localeNames[locale]}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
