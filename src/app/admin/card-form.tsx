'use client';

import { useEffect, useState, useTransition } from 'react';

import type { BeforeAfterCard } from '@/lib/cards';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_ACCEPT,
  MAX_IMAGE_BYTES,
  STORAGE_BUCKET,
} from '@/lib/storage';
import { supabaseBrowser } from '@/lib/supabase-browser';

import { createUploadTicket, saveCard, type ActionState } from './actions';

interface ImageSlot {
  file: File | null;
  /** The card's saved URL, or null once cleared. */
  url: string | null;
  /** Object URL for a freshly picked file. */
  preview: string | null;
  error: string | null;
}

const emptySlot = (url: string | null): ImageSlot => ({
  file: null,
  url,
  preview: null,
  error: null,
});

/**
 * Client-side gate on type and size. The bucket enforces the same two rules
 * server-side; this copy exists so a mistake costs zero bytes of upload.
 */
function validate(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'Faqat JPG, PNG yoki WEBP';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `Rasm juda katta (${mb}MB). Eng koʻpi 5MB.`;
  }
  return null;
}

function ImageField({
  title,
  tag,
  slot,
  onPick,
  onClear,
}: {
  title: string;
  tag: 'OLDIN' | 'KEYIN';
  slot: ImageSlot;
  onPick: (file: File | null) => void;
  onClear: () => void;
}) {
  const src = slot.preview ?? slot.url;

  return (
    <div className="admin-image">
      <span className="admin-image__title">{title}</span>

      <div className="admin-image__preview">
        {src ? (
          // Plain <img>: previews are blob: URLs, which the next/image optimizer
          // cannot fetch, and an admin-only thumbnail needs no optimization.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${tag} — koʻrinishi`} />
        ) : (
          <span className="admin-image__empty">Rasm yo&apos;q</span>
        )}
        <span
          className="img-placeholder__tag"
          style={{
            background: tag === 'OLDIN' ? 'rgba(16,26,40,.78)' : 'var(--color-accent)',
          }}
        >
          {tag}
        </span>
      </div>

      <div className="admin-image__controls">
        <label className="admin-btn admin-btn--ghost admin-image__pick">
          {src ? 'Almashtirish' : 'Rasm tanlash'}
          <input
            type="file"
            accept={IMAGE_ACCEPT}
            onChange={(event) => onPick(event.target.files?.[0] ?? null)}
          />
        </label>
        {src && (
          <button className="admin-btn admin-btn--ghost" type="button" onClick={onClear}>
            Olib tashlash
          </button>
        )}
      </div>

      {slot.error && (
        <p className="admin-error" role="alert">
          {slot.error}
        </p>
      )}
    </div>
  );
}

export default function CardForm({
  card,
  titleId,
  onDone,
}: {
  card: BeforeAfterCard | null;
  /** id for the heading, so the surrounding <dialog> can point at it. */
  titleId: string;
  onDone: () => void;
}) {
  const [before, setBefore] = useState<ImageSlot>(emptySlot(card?.before_image_url ?? null));
  const [after, setAfter] = useState<ImageSlot>(emptySlot(card?.after_image_url ?? null));
  const [state, setState] = useState<ActionState>({});
  const [uploading, setUploading] = useState(false);
  const [saving, startSaving] = useTransition();

  const busy = uploading || saving;

  // Object URLs hold their blob in memory until revoked.
  useEffect(() => {
    return () => {
      if (before.preview) URL.revokeObjectURL(before.preview);
    };
  }, [before.preview]);
  useEffect(() => {
    return () => {
      if (after.preview) URL.revokeObjectURL(after.preview);
    };
  }, [after.preview]);

  function pick(setSlot: typeof setBefore, file: File | null) {
    if (!file) return;

    const error = validate(file);
    if (error) {
      setSlot((slot) => ({ ...slot, error }));
      return;
    }

    // Created outside the updater: state updaters must be pure, and React would
    // otherwise mint (and leak) a second object URL on a double invocation.
    const preview = URL.createObjectURL(file);
    setSlot((slot) => ({ ...slot, file, preview, error: null }));
  }

  /**
   * Uploads straight from the browser to Supabase Storage using a signed token
   * minted by an admin-only Server Action — see `createUploadTicket`. Returns
   * the public URL to store on the row.
   */
  async function upload(file: File): Promise<string> {
    const extension = file.name.split('.').pop() || 'jpg';
    const ticket = await createUploadTicket(extension);

    const storage = supabaseBrowser().storage.from(STORAGE_BUCKET);
    const { error } = await storage.uploadToSignedUrl(ticket.path, ticket.token, file, {
      contentType: file.type,
    });
    if (error) throw new Error(error.message);

    return storage.getPublicUrl(ticket.path).data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({});

    let beforeUrl: string;
    let afterUrl: string;

    setUploading(true);
    try {
      // Sequential, not parallel: two 5MB uploads at once on a phone connection
      // just make each other slower, and one failing mid-flight is easier to
      // reason about this way.
      beforeUrl = before.file ? await upload(before.file) : (before.url ?? '');
      afterUrl = after.file ? await upload(after.file) : (after.url ?? '');
    } catch (error) {
      setState({
        error: `Rasm yuklanmadi: ${error instanceof Error ? error.message : 'nomaʼlum xatolik'}`,
      });
      return;
    } finally {
      setUploading(false);
    }

    const formData = new FormData(form);
    formData.set('before_image_url', beforeUrl);
    formData.set('after_image_url', afterUrl);

    startSaving(async () => {
      const result = await saveCard({}, formData);
      if (result.ok) {
        onDone();
      } else {
        setState(result);
      }
    });
  }

  return (
    <>
      <div className="modal__header">
        <h2 className="modal__title" id={titleId}>
          {card ? 'Kartani tahrirlash' : 'Yangi karta'}
        </h2>
        <button
          className="modal__close"
          type="button"
          onClick={onDone}
          aria-label="Yopish"
          disabled={busy}
        >
          ×
        </button>
      </div>

      <form className="admin-form modal__body" onSubmit={handleSubmit}>
        {card && <input type="hidden" name="id" value={card.id} />}

        <label className="admin-field">
          <span className="admin-field__label">Sarlavha</span>
          <input
            className="admin-field__input"
            name="title"
            defaultValue={card?.title ?? ''}
            placeholder="Salon vakuumi"
            required
            // showModal() honours autofocus; without it focus lands on the
            // close button, which is a poor place to start typing from.
            autoFocus
          />
        </label>

        <div className="admin-form__row">
          <label className="admin-field">
            <span className="admin-field__label">OLDIN matni</span>
            <input
              className="admin-field__input"
              name="before_label"
              defaultValue={card?.before_label ?? ''}
              placeholder="iflos salon"
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">KEYIN matni</span>
            <input
              className="admin-field__input"
              name="after_label"
              defaultValue={card?.after_label ?? ''}
              placeholder="toza salon"
            />
          </label>
        </div>

        <label className="admin-field">
          <span className="admin-field__label">Qo&apos;shimcha ma&apos;lumot</span>
          <input
            className="admin-field__input"
            name="meta"
            defaultValue={card?.meta ?? ''}
            placeholder="Cobalt · 45 daq"
          />
        </label>

        <div className="admin-form__row">
          <ImageField
            title="Oldin"
            tag="OLDIN"
            slot={before}
            onPick={(file) => pick(setBefore, file)}
            onClear={() => setBefore(emptySlot(null))}
          />
          <ImageField
            title="Keyin"
            tag="KEYIN"
            slot={after}
            onPick={(file) => pick(setAfter, file)}
            onClear={() => setAfter(emptySlot(null))}
          />
        </div>

        {state.error && (
          <p className="admin-error" role="alert" aria-live="polite">
            {state.error}
          </p>
        )}

        <div className="admin-form__actions">
          <button className="admin-btn admin-btn--primary" type="submit" disabled={busy}>
            {uploading ? 'Rasm yuklanmoqda…' : saving ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
          <button
            className="admin-btn admin-btn--ghost"
            type="button"
            onClick={onDone}
            disabled={busy}
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </>
  );
}
