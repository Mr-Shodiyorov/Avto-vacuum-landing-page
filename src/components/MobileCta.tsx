import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { site } from '@/lib/site';

import './mobile-cta.css';

const primaryPhone = site.phones[0];

export default function MobileCta() {
  return (
    <div className="mobile-cta">
      <a className="mobile-cta__call" href={primaryPhone.href}>
        <PhoneIcon size={18} />
        Qo&apos;ng&apos;iroq
      </a>
      <a
        className="mobile-cta__insta"
        href={site.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram — ${site.instagram.handle}`}
      >
        <InstagramIcon size={22} />
      </a>
    </div>
  );
}
