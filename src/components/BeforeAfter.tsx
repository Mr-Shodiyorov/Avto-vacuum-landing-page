import { getTranslations } from 'next-intl/server';

import Lightbox from "@/components/Lightbox";
import WorkImage from "@/components/WorkImage";
import { cardImageAlt, getCards, type BeforeAfterCard } from "@/lib/cards";

import "./before-after.css";

/** `ImageObject` entries for every real (non-placeholder) gallery photo. */
function imageObjectsFor(cards: BeforeAfterCard[]) {
  const entries: { url: string; alt: string }[] = [];
  for (const card of cards) {
    if (card.before_image_url) {
      entries.push({ url: card.before_image_url, alt: cardImageAlt(card, 'oldin', card.before_label) });
    }
    if (card.after_image_url) {
      entries.push({ url: card.after_image_url, alt: cardImageAlt(card, 'keyin', card.after_label) });
    }
  }
  return entries;
}

/**
 * Reads its cards from Supabase (table `before_after_cards`, managed at /admin).
 *
 * This is an async Server Component, so the query runs on the server and the
 * browser only ever receives finished HTML — no Supabase client, no keys, no
 * loading spinner. The page it sits on is prerendered and revalidated (see
 * `src/app/page.tsx`), so visitors get static HTML from the CDN.
 */
export default async function BeforeAfter() {
  const t = await getTranslations('beforeAfter');
  const cards = await getCards();
  const imageObjects = imageObjectsFor(cards);

  return (
    <section className="works" id="ishlarimiz">
      {imageObjects.length > 0 && (
        <script
          type="application/ld+json"
          // Tells Google what each photo actually depicts, since the visible
          // page only shows a short "OLDIN/KEYIN" tag next to it.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              imageObjects.map((img) => ({
                '@context': 'https://schema.org',
                '@type': 'ImageObject',
                contentUrl: img.url,
                url: img.url,
                caption: img.alt,
                description: img.alt,
                representativeOfPage: false,
              })),
            ),
          }}
        />
      )}

      <div className="container">
        <div className="works__heading-group" data-reveal>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="section-heading">{t('heading')}</h2>
        </div>

        {/* An empty grid (no rows yet, or a database hiccup) still leaves the
            heading in place so the "Ishlarimiz" nav link has a target. */}
        <div
          className="works__grid"
          // A scrollable region has to be reachable and operable by keyboard,
          // which needs a tab stop and a name to announce when it gets one.
          role="region"
          aria-label={t('galleryAriaLabel')}
          tabIndex={0}
        >
          {cards.map((card, i) => (
            <article
              className="work-card"
              key={card.id}
              data-reveal
              style={
                { "--reveal-delay": `${i * 120}ms` } as React.CSSProperties
              }
            >
              <div className="work-card__images">
                <WorkImage
                  src={card.before_image_url}
                  label={`OLDIN — ${card.before_label}`}
                  alt={cardImageAlt(card, 'oldin', card.before_label)}
                  tag="OLDIN"
                  zoomable
                />
                <WorkImage
                  src={card.after_image_url}
                  label={`KEYIN — ${card.after_label}`}
                  alt={cardImageAlt(card, 'keyin', card.after_label)}
                  tag="KEYIN"
                  zoomable
                />
              </div>
              <div className="work-card__footer">
                <span className="work-card__title">{card.title}</span>
                <span className="work-card__meta">{card.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* One viewer for the whole gallery, wired up by delegation. */}
      <Lightbox />
    </section>
  );
}
