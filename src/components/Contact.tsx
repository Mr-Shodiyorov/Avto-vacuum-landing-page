import { getTranslations } from 'next-intl/server';

import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';
import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { site } from '@/lib/site';

import './contact.css';

const [phone1, phone2] = site.phones;

export default async function Contact() {
  const t = await getTranslations('contact');
  const perks = t.raw('perks') as string[];

  return (
    <section className="contact" id="aloqa">
      <div className="container">
        <div
          className="contact__card"
          data-reveal
          style={{ '--reveal-scale': '0.98' } as React.CSSProperties}
        >
          <span className="shine-border" aria-hidden="true">
            <span className="shine-border__spin" />
          </span>

          <div className="contact__panel contact__panel--call">
            <h2 className="contact__heading">{t('callHeading')}</h2>
            <p className="contact__lead">{t('callLead')}</p>

            <div className="contact__phones">
              <a className="contact__phone contact__phone--accent shimmer-cta" href={phone1.href}>
                <span>{phone1.display}</span>
                <PhoneIcon size={20} />
              </a>
              <a className="contact__phone contact__phone--primary" href={phone2.href}>
                <span>{phone2.display}</span>
                <PhoneIcon size={20} />
              </a>
              <a
                className="contact__insta"
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon size={19} />
                {t('instagramLink', { handle: site.instagram.handle })}
              </a>
            </div>

            <ul className="contact__perks">
              {perks.map((perk) => (
                <li key={perk}>
                  <span className="contact__perk-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5 6.5 12 13 4"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="contact__divider" aria-hidden="true">
            <span className="contact__divider-line" />
            <span className="contact__divider-label">{t('divider')}</span>
            <span className="contact__divider-line" />
          </div>

          <div className="contact__panel contact__panel--form">
            <h2 className="contact__heading">{t('formHeading')}</h2>
            <p className="contact__lead">{t('formLead')}</p>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Outside `.container` on purpose — the container supplies the page
          gutter, so a sibling of it runs the full width of the viewport. */}
      <LocationMap />
    </section>
  );
}
