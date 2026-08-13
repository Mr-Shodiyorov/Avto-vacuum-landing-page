import ImagePlaceholder from '@/components/ImagePlaceholder';
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

          <div className="contact__text">
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
          </div>

          <div className="contact__media">
            <ImagePlaceholder
              label="Servis fotosi yoki xarita skrinshoti"
              ratio="16 / 9"
              radius="14px"
              className="contact__map"
            />

            <div className="contact__info">
              <div className="contact__info-item">
                <span className="contact__info-label">MANZIL</span>
                <span className="contact__info-value">{site.address}</span>
              </div>
              <div className="contact__info-divider" aria-hidden="true" />
              <div className="contact__info-item">
                <span className="contact__info-label">ISH VAQTI</span>
                <span className="contact__info-value">{site.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
