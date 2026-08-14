'use server';

import { getTranslations } from 'next-intl/server';

import { supabaseRead } from '@/lib/supabase';

export interface CommentFormState {
  ok?: boolean;
  error?: string;
}

/**
 * Loose Uzbek phone check: strips everything but digits and a leading `+`,
 * then accepts a bare 9-digit local number or `998` + 9 digits, with or
 * without the `+`. Deliberately not stricter than that — spacing, dashes, and
 * parentheses vary too much between how people type their own number to be
 * worth rejecting.
 */
function isPlausiblePhone(raw: string): boolean {
  const digits = raw.replace(/[^\d+]/g, '').replace(/^\+/, '');
  return /^(998)?\d{9}$/.test(digits);
}

/**
 * Public contact-form submission — no admin session required, anyone can call
 * this. Uses the anon-key client: RLS on `comments` grants that role INSERT
 * only (see supabase/migrations/002_comments.sql), so even a malicious caller
 * can add rows, never read or modify existing ones.
 */
export async function submitComment(
  locale: string,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const t = await getTranslations({ locale, namespace: 'contactForm' });

  // Honeypot: real visitors never see or fill this field (off-screen in
  // contact-form.css, aria-hidden, removed from the tab order). A filled one
  // means a bot — report success without inserting anything, so it looks like
  // the submission "worked" and the bot has no signal to adapt on.
  if (String(formData.get('website') ?? '').trim()) {
    return { ok: true };
  }

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !phone || !message) {
    return { error: t('errorRequired') };
  }
  if (!isPlausiblePhone(phone)) {
    return { error: t('errorPhone') };
  }

  const { error } = await supabaseRead().from('comments').insert({ name, phone, message });
  if (error) {
    console.error('[comments] insert failed:', error);
    return { error: t('errorServer') };
  }

  return { ok: true };
}
