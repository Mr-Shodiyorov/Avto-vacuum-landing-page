'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

import './language-dropdown.css';

const localeLabels: Record<string, string> = {
  uz: 'UZB',
  ru: 'RUS',
  en: 'ENG',
};

const localeNames: Record<string, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

/**
 * Desktop-only header language switcher: a menu-button dropdown rather than
 * the always-visible pill row used in the mobile menu (`LanguageSwitcher`).
 * `pathname` is the locale-stripped path next-intl's `usePathname` resolves,
 * so every option's `Link` preserves the current page — only the locale
 * prefix changes.
 */
export default function LanguageDropdown() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const activeLocale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-dropdown" ref={rootRef}>
      <button
        type="button"
        className="lang-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {localeLabels[activeLocale]}
        <svg
          className="lang-dropdown__chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown__menu" role="menu" aria-label={t('languageSwitcherLabel')}>
          {routing.locales.map((locale) => {
            const isActive = locale === activeLocale;
            return (
              <Link
                key={locale}
                href={pathname}
                locale={locale}
                role="menuitem"
                aria-current={isActive ? 'true' : undefined}
                className={`lang-dropdown__item ${isActive ? 'lang-dropdown__item--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="lang-dropdown__item-code">{localeLabels[locale]}</span>
                <span className="lang-dropdown__item-name">{localeNames[locale]}</span>
                {isActive && (
                  <svg
                    className="lang-dropdown__check"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5 6.5 12 13 4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
