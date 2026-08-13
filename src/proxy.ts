import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE, isValidSession } from '@/lib/session-token';

/**
 * Route guard for the admin panel.
 *
 * NOTE ON THE FILENAME: this is what used to be `middleware.ts`. Next.js 16
 * renamed Middleware to Proxy — same feature, same `config.matcher`, new file
 * name and export name. See
 * node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
 *
 * This is an optimistic check: it only verifies the cookie's signature, never
 * touching the database, because it runs on every matched request including
 * prefetches. The authoritative check lives in `requireSession()`, which every
 * admin page and Server Action calls.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isValidSession(token);

  // /admin/login is the one admin route reachable without a session.
  const isLoginRoute = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  // Redirect targets carry the trailing slash to match `trailingSlash: true`
  // in next.config.ts — otherwise every guard bounce costs an extra 308.
  if (isLoginRoute) {
    // Already signed in? Skip the form.
    if (authed) {
      return NextResponse.redirect(new URL('/admin/', request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL('/admin/login/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Both entries matter: '/admin' alone does not match '/admin/anything', and
  // '/admin/:path*' alone does not match the bare '/admin'. With
  // `trailingSlash: true` the incoming paths are '/admin/' and '/admin/x/',
  // which these patterns cover as well.
  matcher: ['/admin', '/admin/:path*'],
};
