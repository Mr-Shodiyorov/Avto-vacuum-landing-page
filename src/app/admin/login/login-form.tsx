'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { login, type ActionState } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="admin-btn admin-btn--primary" type="submit" disabled={pending}>
      {pending ? 'Tekshirilmoqda…' : 'Kirish'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(login, {});

  return (
    <form className="admin-form" action={formAction}>
      <label className="admin-field">
        <span className="admin-field__label">Parol</span>
        <input
          className="admin-field__input"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>

      {state.error && (
        // aria-live so a screen reader announces the failure without a refocus.
        <p className="admin-error" role="alert" aria-live="polite">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
