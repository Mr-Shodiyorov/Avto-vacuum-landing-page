import { getTranslations } from 'next-intl/server';

import './why-us.css';

export default async function WhyUs() {
  const t = await getTranslations('whyUs');
  const reasons = t.raw('reasons') as { title: string; text: string }[];

  return (
    <section className="why-us" id="nega-biz">
      <div className="container">
        <h2 className="why-us__heading" data-reveal>
          {t('heading')}
        </h2>
        <div className="why-us__grid">
          {reasons.map((reason, i) => (
            <div
              className="why-us__item"
              key={reason.title}
              data-reveal
              style={{ '--reveal-delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <h3 className="why-us__item-title">{reason.title}</h3>
              <p className="why-us__item-text">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
