'use client';

import { useEffect, useRef, useState } from 'react';

import CloseIcon from '@/components/icons/CloseIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import TelegramIcon from '@/components/icons/TelegramIcon';
import { site } from '@/lib/site';

import './support-modal.css';

/** Custom event dispatched when opening the support widget modal. */
export const OPEN_SUPPORT_MODAL_EVENT = 'open-support-modal';

/** Helper function to open support modal. */
export function openSupportModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_SUPPORT_MODAL_EVENT));
  }
}

export default function SupportModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
        setOpen(true);
      }
    }

    window.addEventListener(OPEN_SUPPORT_MODAL_EVENT, handleOpen);
    return () => {
      window.removeEventListener(OPEN_SUPPORT_MODAL_EVENT, handleOpen);
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className="support-widget__trigger"
        aria-label="Aloqa va Yordam"
        onClick={() => openSupportModal()}
      >
        <span className="support-widget__trigger-dot" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className="support-modal"
        aria-label="Avto Vakum Aloqa Markazi"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        <div className="support-modal__box">
          <div className="support-modal__header">
            <div>
              <h3 className="support-modal__title">{site.name} Support</h3>
              <div className="support-modal__status">
                <span className="support-modal__status-dot" />
                <span>Online — tezkor javob</span>
              </div>
            </div>
            <button
              type="button"
              className="support-modal__close"
              aria-label="Yopish"
              onClick={closeModal}
            >
              <CloseIcon size={16} />
            </button>
          </div>

          <p className="support-modal__message">
            Salom! Sizga qanday yordam bera olamiz? Savollaringiz bo&apos;lsa — bizga yozing yoki qo&apos;ng&apos;iroq qiling.
          </p>

          <div className="support-modal__options">
            {/* Telegram Support Option */}
            <a
              href={site.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="support-modal__option"
              onClick={closeModal}
            >
              <div className="support-modal__icon-box">
                <TelegramIcon size={20} color="#229ED9" />
              </div>
              <div className="support-modal__details">
                <span className="support-modal__option-title">Telegram&apos;da yozish</span>
                <span className="support-modal__option-sub">Tezkor javob — 5 daqiqa ichida</span>
              </div>
            </a>

            {/* Primary Phone Option */}
            <a
              href={site.phones[0].href}
              className="support-modal__option support-modal__option--primary"
              onClick={closeModal}
            >
              <div className="support-modal__icon-box">
                <PhoneIcon size={20} />
              </div>
              <div className="support-modal__details">
                <span className="support-modal__option-title">Bizga qo&apos;ng&apos;iroq qiling</span>
                <span className="support-modal__option-sub">{site.phones[0].display}</span>
              </div>
            </a>

            {/* Secondary Phone Option */}
            <a
              href={site.phones[1].href}
              className="support-modal__option"
              onClick={closeModal}
            >
              <div className="support-modal__icon-box">
                <PhoneIcon size={20} />
              </div>
              <div className="support-modal__details">
                <span className="support-modal__option-title">Qo&apos;shimcha telefon liniyasi</span>
                <span className="support-modal__option-sub">{site.phones[1].display}</span>
              </div>
            </a>
          </div>

          <div className="support-modal__footer">
            <span>O&apos;RTACHA JAVOB BERISH VAQTI: 5 DAQIQA</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
