import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  isValidSession,
  signSession,
} from '@/lib/session-token';

/**
 * Single-password admin session.
 *
 * There are no user accounts: one password (`ADMIN_PASSWORD`) buys a signed,
 * httpOnly JWT cookie valid for 7 days. The cookie holds no secrets — just a
 * role marker and an expiry — and is signed with `SESSION_SECRET`, so it cannot
 * be forged client-side. Rotating `SESSION_SECRET` invalidates every
 * outstanding session.
 */

export { SESSION_COOKIE };

/**
 * Constant-time string comparison.
 *
 * A plain `===` bails out at the first differing byte, so response timing leaks
 * how much of the password an attacker guessed correctly. This always walks the
 * full length. (Returning early on a length mismatch is fine — the length is
 * not the secret worth protecting.)
 */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let i = 0; i < left.length; i++) {
    mismatch |= left[i] ^ right[i];
  }
  return mismatch === 0;
}

/** Checks a submitted password against `ADMIN_PASSWORD`. */
export function isCorrectPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error('Missing environment variable ADMIN_PASSWORD.');
  }
  return timingSafeEqual(candidate, expected);
}

/** Issues the session cookie. Only call once `isCorrectPassword` has passed. */
export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await signSession(), {
    httpOnly: true, // invisible to document.cookie, so XSS cannot steal it
    secure: true, // https only — Vercel is always https
    sameSite: 'lax', // survives the top-level redirect after the login POST
    path: '/', // sent to every /admin route
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Clears the session cookie (logout). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Whether the current request carries a valid admin session. */
export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(SESSION_COOKIE)?.value);
}

/**
 * The guard every admin page and Server Action starts with.
 *
 * `proxy.ts` already redirects unauthenticated browsers, but that is an
 * optimistic, routing-level check. Server Actions are POST endpoints that can
 * be invoked directly, so authorization is re-checked here, next to the data.
 */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) {
    redirect('/admin/login');
  }
}
