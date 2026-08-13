'use client';

import InstagramIcon from '@/components/icons/InstagramIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { openPhoneModal } from '@/components/PhoneModal';
import { site } from '@/lib/site';

import './mobile-cta.css';

export default function MobileCta() {
  return (
    <div className="mobile-cta">
      <button
        type="button"
        className="mobile-cta__call"
        onClick={openPhoneModal}
      >
        <PhoneIcon size={18} />
        Qo&apos;ng&apos;iroq
      </button>
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
