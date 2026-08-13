'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import './lightbox.css';

interface Slide {
  src: string;
  alt: string;
}

/**
 * Full-screen viewer for the before/after photos.
 *
 * Rendered once per page and wired up by event delegation: it listens for
 * clicks on anything carrying `data-lightbox` rather than wrapping each image
 * in a client component. That keeps every card server-rendered HTML — the
 * gallery is complete and readable with client JS switched off, and this file
 * only adds the zoom on top.
 *
 * Built on <dialog> rather than a library: PhotoSwipe would be ~30KB of runtime
 * for one interaction, and would arrive with its own visual language to fight.
 * This reuses the same open/close choreography as the admin modals.
 */
export default function Lightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-lightbox]');
      if (!trigger) return;

      // Collected at click time, not on mount: the gallery is server-rendered
      // and can change between visits without this needing to re-subscribe.
      const all = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox]'));
      setSlides(
        all.map((el) => ({
          src: el.dataset.lightbox ?? '',
          alt: el.dataset.lightboxAlt ?? '',
        })),
      );
      setIndex(Math.max(0, all.indexOf(trigger)));
      dialogRef.current?.showModal();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const count = slides.length;

  /** Steps through the gallery, wrapping at both ends. */
  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (count > 0 ? (i + delta + count) % count : i));
    },
    [count],
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (!dialogRef.current?.open) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
    }
    // Esc is handled by <dialog> itself.
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [go]);

  const slide = slides[index];
  const hasMany = count > 1;

  return (
    <dialog
      className="lightbox"
      ref={dialogRef}
      aria-label="Rasmni ko'rish"
      onClick={(event) => {
        // Anything outside the panel closes it. The image and the controls sit
        // inside `.lightbox__inner`, so they never match.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      {slide && (
        <div className="lightbox__inner">
          <button
            className="lightbox__btn lightbox__close"
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Yopish"
          >
            ×
          </button>

          {hasMany && (
            <button
              className="lightbox__btn lightbox__nav lightbox__nav--prev"
              type="button"
              onClick={() => go(-1)}
              aria-label="Oldingi rasm"
            >
              ‹
            </button>
          )}

          <figure className="lightbox__figure">
            <Image
              className="lightbox__img"
              // Keyed by src so React swaps the element instead of mutating it,
              // which lets each slide replay the fade-in.
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              // next/image lazy-loads by default, but this element is created
              // inside a `display: none` dialog — the lazy trigger never fires
              // once it is shown, leaving a blank frame. A slide only exists
              // while the viewer is open, so it should load immediately anyway.
              loading="eager"
            />
          </figure>

          {hasMany && (
            <button
              className="lightbox__btn lightbox__nav lightbox__nav--next"
              type="button"
              onClick={() => go(1)}
              aria-label="Keyingi rasm"
            >
              ›
            </button>
          )}

          <div className="lightbox__caption">
            <span className="lightbox__label">{slide.alt}</span>
            {hasMany && (
              <span className="lightbox__count" aria-live="polite">
                {index + 1} / {count}
              </span>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
