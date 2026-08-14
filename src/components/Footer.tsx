import Logo from '@/components/Logo';
import { site } from '@/lib/site';

import './footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__logo-row">
            <Logo size={36} innerBg="#08325F" textColor="#fff" ringA="#2C7BD1" />
            <span className="site-footer__name">AVTO VAKUM</span>
          </div>
          <p className="site-footer__desc">
            Avto vakum, kuzov kassa prav, palirovka va keramika. Qarshi, 24/7.
          </p>
        </div>

        <div className="site-footer__col">
          <span className="site-footer__label">TELEFON</span>
          {site.phones.map((phone) => (
            <a className="site-footer__link" href={phone.href} key={phone.href}>
              {phone.display}
            </a>
          ))}
        </div>

        <div className="site-footer__col">
          <span className="site-footer__label">IJTIMOIY TARMOQ</span>
          <a
            className="site-footer__link"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram · {site.instagram.handle}
          </a>
          <a
            className="site-footer__link"
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram · {site.telegram.handle}
          </a>
          <span className="site-footer__hours">Har kuni 24 soat</span>
        </div>
      </div>

      <p className="site-footer__copy-mobile">Har kuni 24 soat · © {year} Avto Vakum, Qarshi</p>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>© {year} Avto Vakum · Qarshi</span>
          <span>Barcha huquqlar himoyalangan</span>
        </div>
      </div>
    </footer>
  );
}
