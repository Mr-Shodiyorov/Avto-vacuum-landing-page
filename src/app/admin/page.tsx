import { getCards } from '@/lib/cards';
import { requireSession } from '@/lib/session';

import { logout } from './actions';
import CardsAdmin from './cards-admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // The proxy already redirected anonymous browsers here; this is the check that
  // actually counts, right next to the data.
  await requireSession();

  const cards = await getCards();

  return (
    <main className="admin__main">
      <header className="admin__header">
        <div>
          <span className="eyebrow">BOSHQARUV PANELI</span>
          <h1 className="admin__heading">Oldin va keyin</h1>
        </div>
        <form action={logout}>
          <button className="admin-btn admin-btn--ghost" type="submit">
            Chiqish
          </button>
        </form>
      </header>

      <CardsAdmin cards={cards} />
    </main>
  );
}
