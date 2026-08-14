import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';
import { SESSION_COOKIE, isValidSession } from '@/lib/session-token';

/**
 * Route guard for the admin panel, combined with next-intl's locale routing.
 *
 * NOTE ON THE FILENAME: this is what used to be `middleware.ts`. Next.js 16
 * renamed Middleware to Proxy — same feature, same `config.matcher`, new file
 * name and export name. See
 * node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
 *
 * `/admin/*` is handled entirely by the branch below and never reaches
 * next-intl — it stays single-language, outside the `[locale]` segment. This
 * is an optimistic check: it only verifies the cookie's signature, never
 * touching the database, because it runs on every matched request including
 * prefetches. The authoritative check lives in `requireSession()`, which every
 * admin page and Server Action calls.
 *
 * Everything else goes through next-intl's `as-needed` locale routing: `uz`
 * (the default) is unprefixed, `ru`/`en` get a `/ru`/`/en` prefix.
 */
const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
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

  return handleI18nRouting(request);
}

export const config = {
  // Both admin entries matter: '/admin' alone does not match '/admin/anything',
  // and '/admin/:path*' alone does not match the bare '/admin'. The third
  // pattern is next-intl's standard catch-all (skips _next, api, admin, and
  // any path with a file extension) so locale routing sees everything else.
  matcher: ['/admin', '/admin/:path*', '/((?!admin|_next|api|.*\\..*).*)'],
};
