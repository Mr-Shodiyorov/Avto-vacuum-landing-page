'use client';

import { useState, useTransition } from 'react';

import WorkImage from '@/components/WorkImage';
import type { BeforeAfterCard } from '@/lib/cards';

import { deleteCard } from './actions';

/**
 * Confirmation step for a destructive action.
 *
 * Shows the card itself rather than just its title — the cheapest way to make
 * sure you are deleting the one you meant to.
 */
export default function DeleteDialog({
  card,
  titleId,
  onDone,
}: {
  card: BeforeAfterCard;
  titleId: string;
  onDone: () => void;
}) {
  const [pending, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasImages = Boolean(card.before_image_url || card.after_image_url);

  function confirm() {
    setError(null);
    startDeleting(async () => {
      try {
        const formData = new FormData();
        formData.set('id', card.id);
        await deleteCard(formData);
        onDone();
      } catch {
        setError("O'chirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    });
  }

  return (
    <>
      <div className="modal__header">
        <h2 className="modal__title" id={titleId}>
          Kartani o&apos;chirish
        </h2>
        <button
          className="modal__close"
          type="button"
          onClick={onDone}
          aria-label="Yopish"
          disabled={pending}
        >
          ×
        </button>
      </div>

      <div className="modal__body">
        <div className="modal__preview">
          <div className="work-card__images">
            <WorkImage
              src={card.before_image_url}
              label={`OLDIN — ${card.before_label}`}
              tag="OLDIN"
            />
            <WorkImage
              src={card.after_image_url}
              label={`KEYIN — ${card.after_label}`}
              tag="KEYIN"
            />
          </div>
          <div className="work-card__footer">
            <span className="work-card__title">{card.title}</span>
            <span className="work-card__meta">{card.meta}</span>
          </div>
        </div>

        <p className="modal__warning">
          <strong>{card.title || 'Bu karta'}</strong> butunlay o&apos;chiriladi
          {hasImages && ', yuklangan rasmlar bilan birga'}. Bu amalni qaytarib
          bo&apos;lmaydi.
        </p>

        {error && (
          <p className="admin-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <div className="admin-form__actions">
          <button
            className="admin-btn admin-btn--danger"
            type="button"
            onClick={confirm}
            disabled={pending}
          >
            {pending ? "O'chirilmoqda…" : "Ha, o'chirilsin"}
          </button>
          {/* Focused first: the safe choice should be the one Enter picks. */}
          <button
            className="admin-btn admin-btn--ghost"
            type="button"
            onClick={onDone}
            disabled={pending}
            autoFocus
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </>
  );
}
