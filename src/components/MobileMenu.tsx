'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import CloseIcon from '@/components/icons/CloseIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import MenuIcon from '@/components/icons/MenuIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import TelegramIcon from '@/components/icons/TelegramIcon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { openPhoneModal } from '@/components/PhoneModal';
import { Link } from '@/i18n/navigation';
import { navLinks, site } from '@/lib/site';

import './mobile-menu.css';

export default function MobileMenu() {
  const t = useTranslations('mobileMenu');
  const tNav = useTranslations('nav');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        aria-label={t('menuAriaLabel')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <MenuIcon size={22} />
      </button>

      <dialog
        className="mobile-menu"
        ref={dialogRef}
        aria-label={t('navAriaLabel')}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="mobile-menu__panel">
          <div className="mobile-menu__head">
            <div className="mobile-menu__brand-wrap">
              <Logo size={32} />
              <div className="mobile-menu__brand-text">
                <span className="mobile-menu__name">AVTO VAKUM</span>
                <span className="mobile-menu__tag">QARSHI · 24/7</span>
              </div>
            </div>
            <button
              type="button"
              className="mobile-menu__close"
              aria-label={t('closeAriaLabel')}
              onClick={closeMenu}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <LanguageSwitcher className="mobile-menu__lang-switch" />

          <nav className="mobile-menu__nav" aria-label={t('sectionsAriaLabel')}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>
                <span>{tNav(link.key)}</span>
                <span className="mobile-menu__arrow" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </Link>
            ))}
          </nav>

          <div className="mobile-menu__info-card">
            <div className="mobile-menu__info-row">
              <div className="mobile-menu__status-badge">
                <span className="mobile-menu__status-dot" />
                <span>{t('statusBadge')}</span>
              </div>
              <span className="mobile-menu__info-sub">{t('statusSub')}</span>
            </div>

            <Link href="/#manzil" className="mobile-menu__location-box" onClick={closeMenu}>
              <div className="mobile-menu__location-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="mobile-menu__location-text">
                <span className="mobile-menu__location-title">{t('locationTitle')}</span>
                <span className="mobile-menu__location-address">{site.address}</span>
              </div>
            </Link>
          </div>

          <div className="mobile-menu__actions">
            <a
              className="mobile-menu__pill mobile-menu__pill--telegram"
              href={site.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <TelegramIcon size={18} />
              {t('telegram')}
            </a>
            <a
              className="mobile-menu__pill mobile-menu__pill--instagram"
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <InstagramIcon size={18} color="#0B4A8F" />
              {t('instagram')}
            </a>
          </div>

          <button
            type="button"
            className="mobile-menu__cta mb-5"
            onClick={() => {
              closeMenu();
              openPhoneModal();
            }}
          >
            <PhoneIcon size={19} />
            {t('callCta')}
          </button>
        </div>
      </dialog>
    </>
  );
}
