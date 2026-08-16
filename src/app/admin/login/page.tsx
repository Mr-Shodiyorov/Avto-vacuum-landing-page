import Link from 'next/link';

import LoginForm from './login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="admin__auth">
      <div className="admin-card admin-card--auth">
        <span className="eyebrow">BOSHQARUV PANELI</span>
        <h1 className="admin__auth-heading">Kirish</h1>
        <p className="admin__auth-hint">
          Davom etish uchun parolni kiriting.
        </p>
        <LoginForm />
        <Link href="/" className="admin-btn admin-btn--ghost admin__auth-back">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}
