'use client';

import { useEffect, useRef } from 'react';

import './modal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  /** id of the heading inside `children`, for the dialog's accessible name. */
  labelledBy: string;
  children: React.ReactNode;
}

/**
 * Modal built on the native <dialog> element.
 *
 * Using the platform primitive rather than a div means focus trapping, Esc to
 * close, `inert` background content, and top-layer stacking all come for free
 * and correctly — no z-index arms race, no hand-rolled focus loop.
 *
 * The enter/exit animation is entirely in CSS (see modal.css). React only flips
 * `open`; it never waits on or measures a transition, so there are no timers to
 * drift out of sync with the stylesheet.
 */
export default function Modal({ open, onClose, labelledBy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Guarded both ways: calling showModal() on an already-open dialog throws.
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Esc closes the dialog natively, which would leave React thinking it is
    // still open. The `close` event is the single place every close path —
    // Esc, the button, the backdrop — converges.
    const sync = () => onClose();
    dialog.addEventListener('close', sync);
    return () => dialog.removeEventListener('close', sync);
  }, [onClose]);

  return (
    <dialog
      className="modal"
      ref={ref}
      aria-labelledby={labelledBy}
      // A click landing on the <dialog> itself is a click on the backdrop:
      // the visible panel is the inner __box, which stops it from bubbling.
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
    >
      <div className="modal__box">{children}</div>
    </dialog>
  );
}
