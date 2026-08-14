import { getTranslations } from 'next-intl/server';

import Logo from '@/components/Logo';
import { site } from '@/lib/site';

import './footer.css';

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__logo-row">
            <Logo size={36} innerBg="#08325F" textColor="#fff" ringA="#2C7BD1" />
            <span className="site-footer__name">AVTO VAKUM</span>
          </div>
          <p className="site-footer__desc">{t('description')}</p>
        </div>

        <div className="site-footer__col">
          <span className="site-footer__label">{t('phoneLabel')}</span>
          {site.phones.map((phone) => (
            <a className="site-footer__link" href={phone.href} key={phone.href}>
              {phone.display}
            </a>
          ))}
        </div>

        <div className="site-footer__col">
          <span className="site-footer__label">{t('socialLabel')}</span>
          <a
            className="site-footer__link"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('instagramText', { handle: site.instagram.handle })}
          </a>
          <a
            className="site-footer__link"
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('telegramText', { handle: site.telegram.handle })}
          </a>
          <span className="site-footer__hours">{t('hours')}</span>
        </div>
      </div>

      <p className="site-footer__copy-mobile">{t('copyMobile', { year })}</p>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>{t('copyBottomLeft', { year })}</span>
          <span>{t('copyBottomRight')}</span>
        </div>
      </div>
    </footer>
  );
}
