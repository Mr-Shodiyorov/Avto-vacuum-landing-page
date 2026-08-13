import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';
import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { site } from '@/lib/site';

import './contact.css';

const [phone1, phone2] = site.phones;

export default function Contact() {
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
            <h2 className="contact__heading">Qo&apos;ng&apos;iroq qiling — hoziroq qabul qilamiz</h2>
            <p className="contact__lead">
              Ikkala raqam ham 24 soat ishlaydi. Xizmat narxi va bo&apos;sh joyni telefon orqali
              ayting.
            </p>

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
                Instagram — {site.instagram.handle}
              </a>
            </div>

            <ul className="contact__perks">
              {[
                "Narxni va bo'sh joyni shu zahoti bilib olasiz",
                'Kelish vaqtini birga kelishib olamiz',
                'Savolingizga darhol javob beramiz',
              ].map((perk) => (
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
            <span className="contact__divider-label">YOKI</span>
            <span className="contact__divider-line" />
          </div>

          <div className="contact__panel contact__panel--form">
            <h2 className="contact__heading">
              Yozib qoldiring — o&apos;zimiz qo&apos;ng&apos;iroq qilamiz
            </h2>
            <p className="contact__lead">
              Ismingiz, telefon raqamingiz va nima kerakligini yozing — tez orada bog&apos;lanamiz.
            </p>
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
