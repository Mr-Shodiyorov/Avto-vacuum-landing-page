import Image from 'next/image';

import ustaPhoto from '@/assets/usta-hero.webp';
import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
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
  unit?: string;
  label: string;
  icon: string;
}

const stats: Stat[] = [
  {
    count: 5000,
    sep: true,
    suffix: '+',
    label: 'tozalangan avtomobil',
    icon: '<path d="M3 8.5 6.5 12 13 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    count: 7,
    unit: 'yil',
    label: 'tajribali ustalar',
    icon: '<path d="M8 1.5l1.9 4.2 4.6.5-3.5 3.1 1 4.6L8 11.6l-4 2.3 1-4.6L1.5 6.2l4.6-.5L8 1.5Z" fill="#fff"/>',
  },
  {
    count: 40,
    unit: 'daq',
    label: "o'rtacha vakuum vaqti",
    icon: '<circle cx="8" cy="8" r="6" stroke="#fff" stroke-width="1.6"/><path d="M8 4.5V8l2.5 1.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
  },
  {
    text: '24/7',
    label: 'har doim ishlaymiz',
    icon: '<path d="M8.5 1 3 9.5h3.2L5 15l6-8H7.6L8.5 1Z" fill="#fff"/>',
  },
];

const groupDigits = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const headingWords = 'Avtomobilingiz ko‘rinishini bir harakatda tiklang'.split(' ');

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <p className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          24/7 OCHIQ · HOZIR ISHLAYMIZ
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

        <p className="hero__lead">
          Avto vakuum, kuzov kassa prav, palirovka va keramika. Qarshi markazida, kechayu kunduz.
          Navbatsiz qabul qilamiz — qo&apos;ng&apos;iroq qiling va keling.
        </p>

        <div className="hero__media">
          <div className="hero__portrait">
            <Image
              src={ustaPhoto}
              alt={`${master.title} — Avto Vakum`}
              width={546}
              height={457}
              priority
              className="hero__portrait-img"
            />
          </div>

          <div className="hero__stat-badges">
            {stats.map((stat) => (
              <div className="hero__stat-badge" key={stat.label}>
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
                          {stat.unit ? ` ${stat.unit}` : ''}
                        </>
                      )}
                    </span>
                    <span className="hero__stat-badge-label">{stat.label}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__cta">
          <a className="hero__cta-call shimmer-cta" href={primaryPhone.href}>
            <PhoneIcon size={20} />
            {primaryPhone.display}
          </a>
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
