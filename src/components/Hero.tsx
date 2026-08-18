'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import ustaPhoto from '@/assets/avto-vakum-usta-qarshi.webp';
import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { openPhoneModal } from '@/components/PhoneModal';
import { master, site } from '@/lib/site';

import './hero.css';

const primaryPhone = site.phones[0];

interface Stat {
  /** Numeric stats count up on scroll; `text` stats render as-is. */
  count?: number;
  text?: string;
  /** Group thousands with a space, e.g. 5000 -> "5 000". */
  sep?: boolean;
  suffix?: string;
  /** Key into hero.stats.<key> in messages/<locale>.json. */
  key: 'cleaned' | 'experience' | 'avgTime' | 'alwaysOpen';
  hasUnit?: boolean;
  icon: string;
}

const stats: Stat[] = [
  {
    count: 5000,
    sep: true,
    suffix: '+',
    key: 'cleaned',
    icon: '<path d="M3 8.5 6.5 12 13 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    count: 7,
    hasUnit: true,
    key: 'experience',
    icon: '<path d="M8 1.5l1.9 4.2 4.6.5-3.5 3.1 1 4.6L8 11.6l-4 2.3 1-4.6L1.5 6.2l4.6-.5L8 1.5Z" fill="#fff"/>',
  },
  {
    count: 40,
    hasUnit: true,
    key: 'avgTime',
    icon: '<circle cx="8" cy="8" r="6" stroke="#fff" stroke-width="1.6"/><path d="M8 4.5V8l2.5 1.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
  },
  {
    text: '24/7',
    key: 'alwaysOpen',
    icon: '<path d="M8.5 1 3 9.5h3.2L5 15l6-8H7.6L8.5 1Z" fill="#fff"/>',
  },
];

const groupDigits = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Consecutive taps allowed to land within this window before the counter resets. */
const ADMIN_TAP_WINDOW_MS = 1500;
const ADMIN_TAP_COUNT = 3;

export default function Hero() {
  const t = useTranslations('hero');
  const headingWords = t('heading').split(' ');

  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handlePortraitClick() {
    tapCount.current += 1;

    if (tapTimer.current) clearTimeout(tapTimer.current);

    if (tapCount.current >= ADMIN_TAP_COUNT) {
      tapCount.current = 0;
      window.location.href = '/admin/login';
      return;
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, ADMIN_TAP_WINDOW_MS);
  }

  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <p className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          {t('badge')}
        </p>

        <h1 className="hero__heading">
          {/* The space lives outside the span: a trailing space *inside* an
              inline-block is trimmed, which would run the words together both
              visually and for screen readers. */}
          {headingWords.map((word, i) => (
            <span key={i}>
              <span
                className="hero__heading-word"
                style={{ '--word-index': i } as React.CSSProperties}
              >
                {word}
              </span>{' '}
            </span>
          ))}
        </h1>

        <p className="hero__lead">{t('lead')}</p>

        <div className="hero__media">
          <div className="hero__portrait" onClick={handlePortraitClick}>
            <Image
              src={ustaPhoto}
              alt={t('portraitAlt', { masterTitle: master.title })}
              width={546}
              height={457}
              preload
              fetchPriority="high"
              className="hero__portrait-img"
            />
          </div>

          <div className="hero__stat-badges">
            {stats.map((stat) => (
              <div className="hero__stat-badge" key={stat.key}>
                <div className="hero__stat-badge-inner">
                  <span
                    className="hero__stat-badge-icon"
                    dangerouslySetInnerHTML={{
                      __html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">${stat.icon}</svg>`,
                    }}
                  />
                  <span className="hero__stat-badge-text">
                    <span className="hero__stat-badge-value">
                      {stat.text ?? (
                        <>
                          <span
                            className="hero__stat-badge-num"
                            data-count-to={stat.count}
                            data-count-sep={stat.sep ? 'true' : undefined}
                          >
                            {stat.sep ? groupDigits(stat.count!) : stat.count}
                          </span>
                          {stat.suffix ?? ''}
                          {stat.hasUnit ? ` ${t(`stats.${stat.key}.unit`)}` : ''}
                        </>
                      )}
                    </span>
                    <span className="hero__stat-badge-label">{t(`stats.${stat.key}.label`)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__cta">
          <button
            type="button"
            className="hero__cta-call shimmer-cta"
            onClick={openPhoneModal}
          >
            <PhoneIcon size={20} />
            {primaryPhone.display}
          </button>
          <a
            className="hero__cta-insta"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon size={18} />
            {site.instagram.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
