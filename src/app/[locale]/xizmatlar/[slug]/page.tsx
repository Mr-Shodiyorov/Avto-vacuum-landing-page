import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Lightbox from '@/components/Lightbox';
import ServiceCallCta from '@/components/ServiceCallCta';
import WorkImage from '@/components/WorkImage';
import { localeAlternates, ogLocale } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { canonicalImageUrl, cardImageAlt, cardsMatchingKeywords, getCards } from '@/lib/cards';
import { getService, services } from '@/lib/services';
import { businessId, site } from '@/lib/site';

import './service-page.css';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: 'services' });
  const metaTitle = t(`items.${service.slug}.metaTitle`);
  const metaDescription = t(`items.${service.slug}.metaDescription`);

  // Trailing slash matches this site's `trailingSlash: true` config.
  const path = `/xizmatlar/${service.slug}/`;
  const languages = localeAlternates(path);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: languages[locale], languages },
    openGraph: {
      type: 'website',
      siteName: site.nameFull,
      title: metaTitle,
      description: metaDescription,
      url: languages[locale],
      locale: ogLocale[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);

  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations('servicePage');
  const tServices = await getTranslations('services');
  const title = tServices(`items.${service.slug}.title`);
  const h1 = tServices(`items.${service.slug}.h1`);
  const metaDescription = tServices(`items.${service.slug}.metaDescription`);
  const paragraphs = tServices.raw(`items.${service.slug}.paragraphs`) as string[];

  const relatedServices = services.filter((s) => s.slug !== service.slug);

  const allCards = await getCards();
  // Best-effort: no `service` column on the table, so this matches on title
  // text. An empty result means "no confidently-relevant photos yet" — see
  // `cardsMatchingKeywords` — so the gallery section just doesn't render
  // rather than showing another service's work under this one's name.
  const gallery = cardsMatchingKeywords(allCards, service.keywords).slice(0, 4);

  const pageUrl = `${site.url}/xizmatlar/${service.slug}/`;

  const imageObjects = gallery.flatMap((card) => {
    const entries: { url: string; alt: string }[] = [];
    if (card.before_image_url) {
      entries.push({
        url: canonicalImageUrl(card.before_image_url),
        alt: cardImageAlt(card, 'oldin', card.before_label),
      });
    }
    if (card.after_image_url) {
      entries.push({
        url: canonicalImageUrl(card.after_image_url),
        alt: cardImageAlt(card, 'keyin', card.after_label),
      });
    }
    return entries;
  });

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${title} — ${site.nameFull}`,
      serviceType: title,
      description: metaDescription,
      provider: { '@id': businessId },
      areaServed: { '@type': 'City', name: site.city },
      url: pageUrl,
    },
    ...imageObjects.map((img) => ({
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: img.url,
      url: img.url,
      caption: img.alt,
      description: img.alt,
      representativeOfPage: false,
    })),
  ];

  return (
    <>
      <Header />
      <main id="main">
        <section className="service-page">
          <div className="container service-page__inner">
            <nav className="service-page__breadcrumb" aria-label={t('breadcrumbAriaLabel')}>
              <Link href="/">{t('breadcrumbHome')}</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#xizmatlar">{t('breadcrumbServices')}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>

            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="service-page__h1">{h1}</h1>

            <div className="service-page__content">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <ServiceCallCta />

            {gallery.length > 0 && (
              <div className="service-page__gallery">
                <h2 className="section-heading">{t('galleryHeading')}</h2>
                <div className="service-page__gallery-grid">
                  {gallery.map((card) => (
                    <article className="service-page__gallery-pair" key={card.id}>
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
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="service-page__related">
              <h2 className="section-heading">{t('relatedHeading')}</h2>
              <div className="service-page__related-grid">
                {relatedServices.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/xizmatlar/${related.slug}/`}
                    className="service-page__related-card"
                    style={{ '--related-color': related.color } as React.CSSProperties}
                  >
                    <span className="service-page__related-title">
                      {tServices(`items.${related.slug}.title`)}
                    </span>
                    <span className="service-page__related-desc">
                      {tServices(`items.${related.slug}.cardDescription`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Lightbox />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
