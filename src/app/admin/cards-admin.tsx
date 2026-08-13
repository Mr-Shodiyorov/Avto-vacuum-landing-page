'use client';

import { useCallback, useState } from 'react';
import { useFormStatus } from 'react-dom';

import WorkImage from '@/components/WorkImage';
// Type-only import: erased at compile time, so the `server-only` module behind
// it is never bundled for the browser.
import type { BeforeAfterCard } from '@/lib/cards';

// The admin list reuses `.work-card` / `.works__grid` so a card looks identical
// to the public one. Those rules ship with <BeforeAfter>, which this page never
// renders — without this import the cards lose their card styling and their
// side-by-side image grid, and each image expands to a full-width square.
import '@/components/before-after.css';

import { moveCard } from './actions';
import CardForm from './card-form';
import DeleteDialog from './delete-dialog';
import Modal from './modal';

/** Only one dialog is ever open, so a single heading id is enough. */
const MODAL_TITLE_ID = 'admin-modal-title';

type ModalState =
  | { kind: 'form'; card: BeforeAfterCard | null }
  | { kind: 'delete'; card: BeforeAfterCard };

function IconButton({
  label,
  children,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className="admin-btn admin-btn--icon"
      type="submit"
      title={label}
      aria-label={label}
      disabled={disabled || pending}
    >
      {children}
    </button>
  );
}

function AdminCard({
  card,
  isFirst,
  isLast,
  onEdit,
  onDelete,
}: {
  card: BeforeAfterCard;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="work-card admin-work-card">
      <div className="work-card__images">
        <WorkImage
          src={card.before_image_url}
          label={`OLDIN — ${card.before_label}`}
          tag="OLDIN"
        />
        <WorkImage src={card.after_image_url} label={`KEYIN — ${card.after_label}`} tag="KEYIN" />
      </div>

      <div className="work-card__footer">
        <span className="work-card__title">{card.title}</span>
        <span className="work-card__meta">{card.meta}</span>
      </div>

      <div className="admin-work-card__actions">
        <form action={moveCard} className="admin-work-card__move">
          <input type="hidden" name="id" value={card.id} />
          <input type="hidden" name="direction" value="up" />
          <IconButton label="Yuqoriga" disabled={isFirst}>
            ↑
          </IconButton>
        </form>
        <form action={moveCard} className="admin-work-card__move">
          <input type="hidden" name="id" value={card.id} />
          <input type="hidden" name="direction" value="down" />
          <IconButton label="Pastga" disabled={isLast}>
            ↓
          </IconButton>
        </form>

        <button className="admin-btn admin-btn--ghost" type="button" onClick={onEdit}>
          Tahrirlash
        </button>
        <button
          className="admin-btn admin-btn--ghost admin-btn--danger-text"
          type="button"
          onClick={onDelete}
        >
          O&apos;chirish
        </button>
      </div>
    </article>
  );
}

export default function CardsAdmin({ cards }: { cards: BeforeAfterCard[] }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  // The dialog animates out after `modal` goes null, so it still needs content
  // to render during those ~180ms. `shown` keeps the last one on screen.
  const [shown, setShown] = useState<ModalState | null>(null);
  // Bumped on every open so React remounts the form — otherwise reopening the
  // same card would show whatever was half-typed the previous time.
  const [session, setSession] = useState(0);

  const open = useCallback((next: ModalState) => {
    setShown(next);
    setModal(next);
    setSession((n) => n + 1);
  }, []);

  const close = useCallback(() => setModal(null), []);

  return (
    <>
      <div className="admin__toolbar">
        <button
          className="admin-btn admin-btn--primary"
          type="button"
          onClick={() => open({ kind: 'form', card: null })}
        >
          + Yangi karta
        </button>
        <span className="admin__count">{cards.length} ta karta</span>
      </div>

      {cards.length === 0 && (
        <p className="admin__empty">
          Hozircha karta yo&apos;q. &laquo;Yangi karta&raquo; tugmasi bilan qo&apos;shing.
        </p>
      )}

      <div className="works__grid admin__grid">
        {cards.map((card, i) => (
          <AdminCard
            key={card.id}
            card={card}
            isFirst={i === 0}
            isLast={i === cards.length - 1}
            onEdit={() => open({ kind: 'form', card })}
            onDelete={() => open({ kind: 'delete', card })}
          />
        ))}
      </div>

      <Modal open={modal !== null} onClose={close} labelledBy={MODAL_TITLE_ID}>
        {shown?.kind === 'form' && (
          <CardForm
            key={session}
            card={shown.card}
            titleId={MODAL_TITLE_ID}
            onDone={close}
          />
        )}
        {shown?.kind === 'delete' && (
          <DeleteDialog
            key={session}
            card={shown.card}
            titleId={MODAL_TITLE_ID}
            onDone={close}
          />
        )}
      </Modal>
    </>
  );
}
