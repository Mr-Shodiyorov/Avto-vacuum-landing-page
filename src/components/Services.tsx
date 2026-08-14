import { getTranslations } from 'next-intl/server';

import ScrollRevealContentA, { ItemContent } from './ui/scroll-reveal-content-a';
import { services } from '@/lib/services';
import './services.css';

export default async function Services() {
  const t = await getTranslations('services');

  const items: ItemContent[] = services.map((service) => ({
    title: t(`items.${service.slug}.title`),
    description: t(`items.${service.slug}.cardDescription`),
    color: service.color,
    viewBox: service.viewBox,
    icon: service.icon,
    href: `/xizmatlar/${service.slug}/`,
  }));

  return (
    <section className="services" id="xizmatlar">
      <div className="container">
        <div className="services__head" data-reveal>
          <div className="services__heading-group">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="section-heading">{t('heading')}</h2>
          </div>
          <p className="services__note">{t('note')}</p>
        </div>
      </div>

      <ScrollRevealContentA items={items} moreLabel={t('moreLink')} />
    </section>
  );
}
