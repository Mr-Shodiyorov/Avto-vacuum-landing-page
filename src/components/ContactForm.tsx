'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { submitComment, type CommentFormState } from '@/app/contact-actions';

import './contact-form.css';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="contact-form__submit shimmer-cta" type="submit" disabled={pending}>
      {pending ? 'Yuborilmoqda…' : 'Yuborish'}
    </button>
  );
}

/**
 * Just the `<form>` — the heading, lead text, and card chrome around it live
 * in Contact.tsx, which renders this as the "Yozib qoldiring" panel next to
 * the call panel.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState<CommentFormState, FormData>(
    async (prevState, formData) => {
      const result = await submitComment(prevState, formData);
      // Clears the form only on success — an error must never wipe out what
      // the visitor already typed.
      if (result.ok) formRef.current?.reset();
      return result;
    },
    {},
  );

  return (
    <form ref={formRef} className="contact-form__form" action={formAction}>
      {/* Honeypot: invisible and out of the tab order for real visitors
          (see .contact-form__hp); bots that fill every field trip the check
          in submitComment. */}
      <label className="contact-form__hp" aria-hidden="true">
        Sayt
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">Ism</span>
        <input
          className="contact-form__input"
          type="text"
          name="name"
          placeholder="Ismingiz"
          autoComplete="name"
          required
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">Telefon raqam</span>
        <input
          className="contact-form__input"
          type="tel"
          name="phone"
          placeholder="+998 90 123 45 67"
          autoComplete="tel"
          required
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">Komment</span>
        <textarea
          className="contact-form__input contact-form__textarea"
          name="message"
          placeholder="Nima haqida?"
          rows={4}
          required
        />
      </label>

      {state.error && (
        <p className="contact-form__error" role="alert" aria-live="polite">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="contact-form__success" role="status" aria-live="polite">
          Rahmat! Tez orada bog&apos;lanamiz.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
