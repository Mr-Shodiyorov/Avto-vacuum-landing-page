'use client';

import { useState, useTransition } from 'react';

import type { Comment } from '@/lib/comments';

import { deleteComment } from './actions';

/**
 * Confirmation step for a destructive action — same pattern as
 * DeleteDialog for cards, deliberately not a native confirm().
 */
export default function CommentDeleteDialog({
  comment,
  titleId,
  onCancel,
  onDeleted,
}: {
  comment: Comment;
  titleId: string;
  onCancel: () => void;
  onDeleted: (id: string) => void;
}) {
  const [pending, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    setError(null);
    startDeleting(async () => {
      try {
        const formData = new FormData();
        formData.set('id', comment.id);
        await deleteComment(formData);
        onDeleted(comment.id);
      } catch {
        setError("O'chirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    });
  }

  return (
    <>
      <div className="modal__header">
        <h2 className="modal__title" id={titleId}>
          Murojaatni o&apos;chirish
        </h2>
        <button
          className="modal__close"
          type="button"
          onClick={onCancel}
          aria-label="Yopish"
          disabled={pending}
        >
          ×
        </button>
      </div>

      <div className="modal__body">
        <p className="modal__warning">
          <strong>{comment.name}</strong> dan kelgan murojaat butunlay o&apos;chiriladi. Bu amalni
          qaytarib bo&apos;lmaydi.
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
          <button
            className="admin-btn admin-btn--ghost"
            type="button"
            onClick={onCancel}
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
