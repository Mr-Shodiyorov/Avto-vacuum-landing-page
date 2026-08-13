import type { Metadata } from 'next';

import './admin.css';

/**
 * Nothing under /admin may ever be cached or prerendered: every page here is a
 * function of the session cookie. Without this, Vercel can hand a visitor the
 * HTML it built for someone else — the classic "I logged in but still see the
 * login page until I hard-refresh" symptom.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Boshqaruv paneli — Avto Vakum',
  // Belt and braces alongside the Disallow in src/app/robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
