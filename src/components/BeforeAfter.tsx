import Lightbox from "@/components/Lightbox";
import WorkImage from "@/components/WorkImage";
import { getCards } from "@/lib/cards";

import "./before-after.css";

/**
 * Reads its cards from Supabase (table `before_after_cards`, managed at /admin).
 *
 * This is an async Server Component, so the query runs on the server and the
 * browser only ever receives finished HTML — no Supabase client, no keys, no
 * loading spinner. The page it sits on is prerendered and revalidated (see
 * `src/app/page.tsx`), so visitors get static HTML from the CDN.
 */
export default async function BeforeAfter() {
  const cards = await getCards();

  return (
    <section className="works" id="ishlarimiz">
      <div className="container">
        <div className="works__heading-group" data-reveal>
          <span className="eyebrow">ISHLARIMIZ</span>
          <h2 className="section-heading">Oldin va keyin</h2>
        </div>

        {/* An empty grid (no rows yet, or a database hiccup) still leaves the
            heading in place so the "Ishlarimiz" nav link has a target. */}
        <div
          className="works__grid"
          // A scrollable region has to be reachable and operable by keyboard,
          // which needs a tab stop and a name to announce when it gets one.
          role="region"
          aria-label="Ishlarimiz galereyasi"
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
                  tag="OLDIN"
                  zoomable
                />
                <WorkImage
                  src={card.after_image_url}
                  label={`KEYIN — ${card.after_label}`}
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
