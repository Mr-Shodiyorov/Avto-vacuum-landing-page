import { getCards } from '@/lib/cards';
import { getComments, getUnreadCommentCount } from '@/lib/comments';
import { requireSession } from '@/lib/session';

import AdminTabs from './admin-tabs';
import { logout } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // The proxy already redirected anonymous browsers here; this is the check that
  // actually counts, right next to the data.
  await requireSession();

  const [cards, commentsPage, unreadCount] = await Promise.all([
    getCards(),
    getComments(),
    getUnreadCommentCount(),
  ]);

  return (
    <main className="admin__main">
      <header className="admin__header">
        <div>
          <span className="eyebrow">BOSHQARUV PANELI</span>
          <h1 className="admin__heading">Admin panel</h1>
        </div>
        <form action={logout}>
          <button className="admin-btn admin-btn--ghost" type="submit">
            Chiqish
          </button>
        </form>
      </header>

      <AdminTabs cards={cards} commentsPage={commentsPage} unreadCount={unreadCount} />
    </main>
  );
}
