import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist } from 'next/font/google';

import '@/styles/global.css';
import './admin.css';

import { cn } from '@/lib/utils';

/**
 * Independent root layout: `/admin` sits outside the `[locale]` segment (see
 * src/proxy.ts), so it can't share the public site's root layout — Next.js
 * only passes a dynamic segment's params to layouts at or below that segment,
 * and `/admin` has no `[locale]` in its path at all. This is Next's
 * "multiple root layouts" pattern: no shared `app/layout.tsx`, each top-level
 * route defines its own `<html>`/`<body>`.
 *
 * Unlike the public site, this intentionally does NOT mount
 * Preloader/PhoneModal/SupportModal/Motion or the LocalBusiness JSON-LD —
 * those are visitor-facing conversion widgets with no purpose on a
 * login-gated management panel.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Boshqaruv paneli — Avto Vakum',
  // Belt and braces alongside the Disallow in src/app/robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const manrope = localFont({
  src: '../../assets/fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-manrope',
});

const plexSans = localFont({
  src: [
    { path: '../../assets/fonts/ibm-plex-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/ibm-plex-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/ibm-plex-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-plex-sans',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={cn(manrope.variable, plexSans.variable, 'font-sans', geist.variable)} suppressHydrationWarning>
      <body>
        <div className="admin">{children}</div>
      </body>
    </html>
  );
}
