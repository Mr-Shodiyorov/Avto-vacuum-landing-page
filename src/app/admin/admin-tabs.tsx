'use client';

import { useState } from 'react';

// Type-only imports: erased at compile time, so the `server-only` modules
// behind them are never bundled for the browser.
import type { BeforeAfterCard } from '@/lib/cards';
import type { CommentsPage } from '@/lib/comments';

import CardsAdmin from './cards-admin';
import CommentsAdmin from './comments-admin';

type Tab = 'cards' | 'comments';

/**
 * The pill switch below the admin header, and the two sections it toggles.
 *
 * Both sections stay mounted (`hidden` rather than conditional rendering) so
 * CommentsAdmin's "load more" pagination state survives switching tabs and
 * back, instead of re-fetching page one every time.
 */
export default function AdminTabs({
  cards,
  commentsPage,
  unreadCount,
}: {
  cards: BeforeAfterCard[];
  commentsPage: CommentsPage;
  unreadCount: number;
}) {
  const [tab, setTab] = useState<Tab>('cards');

  return (
    <>
      <div className="admin-switch" role="tablist" aria-label="Boshqaruv bo'limlari">
        <span
          className="admin-switch__thumb"
          style={{ transform: tab === 'cards' ? 'translateX(0)' : 'translateX(100%)' }}
          aria-hidden="true"
        />
        <button
          className="admin-switch__btn"
          type="button"
          role="tab"
          aria-selected={tab === 'cards'}
          data-active={tab === 'cards'}
          onClick={() => setTab('cards')}
        >
          Kardslar
        </button>
        <button
          className="admin-switch__btn"
          type="button"
          role="tab"
          aria-selected={tab === 'comments'}
          data-active={tab === 'comments'}
          onClick={() => setTab('comments')}
        >
          Komentlar
          {unreadCount > 0 && <span className="admin-switch__badge">{unreadCount}</span>}
        </button>
      </div>

      <div hidden={tab !== 'cards'}>
        <CardsAdmin cards={cards} />
      </div>
      <div hidden={tab !== 'comments'}>
        <CommentsAdmin initialPage={commentsPage} />
      </div>
    </>
  );
}
