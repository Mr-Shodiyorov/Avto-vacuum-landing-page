import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Lightbox from '@/components/Lightbox';
import ServiceCallCta from '@/components/ServiceCallCta';
import WorkImage from '@/components/WorkImage';
import { cardImageAlt, cardsMatchingKeywords, getCards } from '@/lib/cards';
import { getService, services } from '@/lib/services';
import { businessId, site } from '@/lib/site';

import './service-page.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  // Trailing slash matches this site's `trailingSlash: true` config.
  const path = `/xizmatlar/${service.slug}/`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.nameFull,
      title: service.metaTitle,
      description: service.metaDescription,
      url: path,
      locale: 'uz_UZ',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

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
      entries.push({ url: card.before_image_url, alt: cardImageAlt(card, 'oldin', card.before_label) });
    }
    if (card.after_image_url) {
      entries.push({ url: card.after_image_url, alt: cardImageAlt(card, 'keyin', card.after_label) });
    }
    return entries;
  });

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${service.title} — ${site.nameFull}`,
      serviceType: service.title,
      description: service.metaDescription,
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
            <nav className="service-page__breadcrumb" aria-label="Yo'l">
              <Link href="/">Bosh sahifa</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#xizmatlar">Xizmatlar</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{service.title}</span>
            </nav>

            <span className="eyebrow">XIZMAT</span>
            <h1 className="service-page__h1">{service.h1}</h1>

            <div className="service-page__content">
              {service.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <ServiceCallCta />

            {gallery.length > 0 && (
              <div className="service-page__gallery">
                <h2 className="section-heading">Bizning ishlarimizdan</h2>
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
              <h2 className="section-heading">Boshqa xizmatlarimiz</h2>
              <div className="service-page__related-grid">
                {relatedServices.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/xizmatlar/${related.slug}/`}
                    className="service-page__related-card"
                    style={{ '--related-color': related.color } as React.CSSProperties}
                  >
                    <span className="service-page__related-title">{related.title}</span>
                    <span className="service-page__related-desc">{related.cardDescription}</span>
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
