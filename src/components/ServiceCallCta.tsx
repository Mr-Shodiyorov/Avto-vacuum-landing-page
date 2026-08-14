'use client';

import PhoneIcon from '@/components/icons/PhoneIcon';
import { openPhoneModal } from '@/components/PhoneModal';
import { site } from '@/lib/site';

const primaryPhone = site.phones[0];

/**
 * Standalone call button for the `/xizmatlar/[slug]` pages.
 *
 * `PhoneModal` is mounted once, globally, in the root layout — this only
 * needs to dispatch its open event, which is why it can stay this small
 * instead of pulling the whole page into a client component.
 */
export default function ServiceCallCta({ label = "Qo'ng'iroq qilish" }: { label?: string }) {
  return (
    <button type="button" className="service-page__cta-call shimmer-cta" onClick={openPhoneModal}>
      <PhoneIcon size={20} />
      {label} — {primaryPhone.display}
    </button>
  );
}
