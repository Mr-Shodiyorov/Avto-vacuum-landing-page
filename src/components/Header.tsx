'use client';

import { useTranslations } from 'next-intl';

import Logo from '@/components/Logo';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TelegramIcon from '@/components/icons/TelegramIcon';
import LanguageDropdown from '@/components/LanguageDropdown';
import MobileMenu from '@/components/MobileMenu';
import { openPhoneModal } from '@/components/PhoneModal';
import { Link } from '@/i18n/navigation';
import { navLinks, site } from '@/lib/site';

import './header.css';

const primaryPhone = site.phones[0];

export default function Header() {
  const t = useTranslations('header');
  const tNav = useTranslations('nav');

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/#top" className="site-header__brand" aria-label={t('brandAriaLabel', { name: site.name })}>
          <Logo size={46} />
          <span className="site-header__brand-text">
            <span className="site-header__name">AVTO VAKUM</span>
            <span className="site-header__tag">QARSHI · 24/7</span>
          </span>
        </Link>

        <nav className="site-header__nav" aria-label={t('navAriaLabel')}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {tNav(link.key)}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <LanguageDropdown />
          <button
            type="button"
            className="site-header__phone"
            onClick={openPhoneModal}
          >
            {primaryPhone.display}
          </button>
          <a
            className="site-header__icon-btn"
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('telegramAriaLabel', { handle: site.telegram.handle })}
          >
            <TelegramIcon size={20} color="#229ED9" />
          </a>
          <a
            className="site-header__icon-btn"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('instagramAriaLabel', { handle: site.instagram.handle })}
          >
            <InstagramIcon size={20} color="#0B4A8F" />
          </a>
          <button
            type="button"
            className="site-header__cta"
            onClick={openPhoneModal}
          >
            {t('callCta')}
          </button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
