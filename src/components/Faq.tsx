import { getTranslations } from 'next-intl/server';

import { site } from '@/lib/site';

import './faq.css';

interface FaqItem {
  q: string;
  a: string;
}

/**
 * Homepage FAQ. Built on native `<details>/`<summary>` so it expands with no
 * client JS — same constraint as the rest of the page (see CLAUDE.md).
 *
 * It also emits the `FAQPage` structured data for these exact questions, so
 * the answers stay a single source of truth: the JSON-LD can never describe
 * something different from what a visitor reads on the page.
 */
export default async function Faq() {
  const t = await getTranslations('faq');
  const items = t.raw('items') as FaqItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${site.url}/#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="faq" id="savollar">
      <div className="container">
        <div className="faq__head" data-reveal>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="section-heading">{t('heading')}</h2>
        </div>

        <div className="faq__list">
          {items.map((item, i) => (
            <details
              className="faq__item"
              key={item.q}
              data-reveal
              style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
            >
              <summary className="faq__q">
                <h3 className="faq__q-text">{item.q}</h3>
                <span className="faq__q-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 3v10M3 8h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
