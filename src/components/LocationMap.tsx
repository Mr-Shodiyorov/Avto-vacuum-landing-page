'use client';

import { useEffect, useRef, useState } from 'react';

import { location, site } from '@/lib/site';

import './location-map.css';

/**
 * Full-bleed map at the foot of the contact section.
 *
 * Three things are deliberate here:
 *
 * 1. The embed is `loading="lazy"` and sits below the fold, so it is never
 *    fetched during a Lighthouse run — the map costs nothing on the metrics
 *    that matter, and only loads for someone who actually scrolls to it.
 * 2. The iframe is `pointer-events: none`. A tiny map you can pan is worse
 *    than useless on a phone; the whole surface is a link instead.
 * 3. That link is a real `<a href>` to Google Maps, so it works with client JS
 *    disabled. When JS is available the click is intercepted and a chooser
 *    opens instead — Yandex is the more common app in Uzbekistan, and guessing
 *    wrong would send people to an app they don't use.
 */
export default function LocationMap() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(`${location.directions} (${location.lat}, ${location.lng})`);
      setCopied(true);
    } catch {
      /* clipboard blocked — the address is on screen to read anyway */
    }
  }

  return (
    <div className="location" id="manzil">
      <div className="location__frame" data-reveal>
        <iframe
          className="location__embed"
          src={location.maps.embed}
          title={`${site.nameFull} — xaritadagi joylashuvi`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Softens the raw map into the page at both edges. */}
        <span className="location__scrim" aria-hidden="true" />

        {/* A brand-coloured ping on the exact coordinate, which is where the
            embed's own marker is anchored. Deliberately just a ring: the embed
            always draws Google's red pin (its tiles don't render at all
            without the `q=` parameter that produces it), and adding a second
            solid marker on top read as a duplicate rather than a highlight. */}
        <span className="location__pin" aria-hidden="true">
          <span className="location__pin-pulse" />
        </span>

        <div className="location__card">
          <span className="location__eyebrow">BIZ SHU YERDAMIZ</span>
          <p className="location__address">{location.directions}</p>
          <span className="location__cta">
            Yo&apos;l ko&apos;rsatish
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <a
          className="location__hit"
          href={location.maps.google}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            // Only take over when the dialog is actually usable; otherwise let
            // the browser follow the href as normal.
            if (typeof dialogRef.current?.showModal !== 'function') return;
            event.preventDefault();
            dialogRef.current.showModal();
          }}
        >
          <span className="visually-hidden">
            Xaritada ochish — {location.directions}
          </span>
        </a>
      </div>

      <dialog
        className="location-modal"
        ref={dialogRef}
        aria-labelledby="location-modal-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="location-modal__box">
          <h2 className="location-modal__title" id="location-modal-title">
            Qaysi xaritada ochamiz?
          </h2>
          <p className="location-modal__address">{location.directions}</p>

          <div className="location-modal__options">
            <a
              className="location-modal__option"
              href={location.maps.google}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => dialogRef.current?.close()}
            >
              <span className="location-modal__option-name">Google Xaritalar</span>
              <span className="location-modal__option-meta">Google Maps</span>
            </a>
            <a
              className="location-modal__option"
              href={location.maps.yandex}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => dialogRef.current?.close()}
            >
              <span className="location-modal__option-name">Yandex Xaritalar</span>
              <span className="location-modal__option-meta">Yandex Maps</span>
            </a>
            <button className="location-modal__option" type="button" onClick={copyAddress}>
              <span className="location-modal__option-name">
                {copied ? 'Nusxa olindi' : 'Manzildan nusxa olish'}
              </span>
              <span className="location-modal__option-meta">
                {location.lat}, {location.lng}
              </span>
            </button>
          </div>

          <button
            className="location-modal__close"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Yopish
          </button>
        </div>
      </dialog>
    </div>
  );
}
