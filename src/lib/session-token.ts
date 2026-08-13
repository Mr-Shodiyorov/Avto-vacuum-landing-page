import { SignJWT, jwtVerify } from 'jose';

/**
 * Signing and verification for the admin session cookie.
 *
 * Deliberately free of `next/headers` and `server-only` so that `proxy.ts` can
 * import it: the proxy inspects the raw cookie off the request rather than
 * through the `cookies()` store. Everything cookie-shaped lives in
 * `src/lib/session.ts`, which builds on this file.
 */

export const SESSION_COOKIE = 'avtovakum_admin';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing environment variable SESSION_SECRET.');
  }
  return new TextEncoder().encode(secret);
}

/** Mints a 7-day admin token. */
export async function signSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

/** True when `token` is a valid, unexpired admin session. Never throws. */
export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    // Expired, tampered with, missing SESSION_SECRET, or signed by an old one.
    return false;
  }
}
