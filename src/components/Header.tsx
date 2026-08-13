'use client';

import Logo from '@/components/Logo';
import InstagramIcon from '@/components/icons/InstagramIcon';
import TelegramIcon from '@/components/icons/TelegramIcon';
import MobileMenu from '@/components/MobileMenu';
import { openPhoneModal } from '@/components/PhoneModal';
import { navLinks, site } from '@/lib/site';

import './header.css';

const primaryPhone = site.phones[0];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="site-header__brand" aria-label={`${site.name} — bosh sahifa`}>
          <Logo size={46} />
          <span className="site-header__brand-text">
            <span className="site-header__name">AVTO VAKUM</span>
            <span className="site-header__tag">QARSHI · 24/7</span>
          </span>
        </a>

        <nav className="site-header__nav" aria-label="Asosiy navigatsiya">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
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
            aria-label={`Telegram — ${site.telegram.handle}`}
          >
            <TelegramIcon size={20} color="#229ED9" />
          </a>
          <a
            className="site-header__icon-btn"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram — ${site.instagram.handle}`}
          >
            <InstagramIcon size={20} color="#0B4A8F" />
          </a>
          <button
            type="button"
            className="site-header__cta"
            onClick={openPhoneModal}
          >
            Qo&apos;ng&apos;iroq qilish
          </button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
