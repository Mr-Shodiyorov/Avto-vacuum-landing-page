'use client';

import { useEffect, useRef, useState } from 'react';

import CloseIcon from '@/components/icons/CloseIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import { site } from '@/lib/site';

import './phone-modal.css';

/** Custom event dispatched when opening the global phone selection modal. */
export const OPEN_PHONE_MODAL_EVENT = 'open-phone-modal';

/** Global helper function to trigger the phone modal from anywhere. */
export function openPhoneModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_PHONE_MODAL_EVENT));
  }
}

export default function PhoneModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
        setOpen(true);
      }
    }

    window.addEventListener(OPEN_PHONE_MODAL_EVENT, handleOpen);
    return () => {
      window.removeEventListener(OPEN_PHONE_MODAL_EVENT, handleOpen);
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="phone-modal"
      aria-label="Telefon raqamini tanlang"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) closeModal();
      }}
    >
      <div className="phone-modal__box">
        <div className="phone-modal__header">
          <div>
            <h3 className="phone-modal__title">Qo&apos;ng&apos;iroq qilish</h3>
            <p className="phone-modal__subtitle">Bog&apos;lanish uchun qulay raqamni tanlang</p>
          </div>
          <button
            type="button"
            className="phone-modal__close"
            aria-label="Yopish"
            onClick={closeModal}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="phone-modal__options">
          {site.phones.map((phone, index) => {
            const isPrimary = index === 0;
            return (
              <a
                key={phone.href}
                href={phone.href}
                className={`phone-modal__option ${isPrimary ? 'phone-modal__option--primary' : ''}`}
                onClick={closeModal}
              >
                <div className="phone-modal__icon-box">
                  <PhoneIcon size={20} />
                </div>
                <div className="phone-modal__details">
                  <span className="phone-modal__tag">
                    {isPrimary ? 'Asosiy raqam · 24/7' : 'Qo\'shimcha liniya'}
                  </span>
                  <span className="phone-modal__number">{phone.display}</span>
                  <span className="phone-modal__subtext">
                    {isPrimary ? 'Navbatsiz tezkor javob' : 'Doimiy aloqa'}
                  </span>
                </div>
                <div className="phone-modal__arrow">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        <div className="phone-modal__footer-badge">
          <span className="phone-modal__status-dot" />
          <span>24/7 xizmatdamiz — dam olish kunlarisiz</span>
        </div>
      </div>
    </dialog>
  );
}
