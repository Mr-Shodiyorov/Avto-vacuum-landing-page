'use client';

import { useState, useTransition } from 'react';

import PhoneIcon from '@/components/icons/PhoneIcon';
import type { Comment, CommentsPage } from '@/lib/comments';

import { loadMoreComments, markCommentRead } from './actions';
import CommentDeleteDialog from './comment-delete-dialog';
import Modal from './modal';

/** Only one dialog is ever open, so a single heading id is enough. */
const MODAL_TITLE_ID = 'comment-delete-title';

/** "2 soat oldin" style relative time; falls back to a date past a week. */
function relativeTime(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'hozirgina';
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} kun oldin`;
  return new Date(iso).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function CommentEntry({
  comment,
  onRead,
  onDelete,
}: {
  comment: Comment;
  onRead: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className={`comment-entry${comment.is_read ? '' : ' comment-entry--unread'}`}
      onClick={() => {
        if (!comment.is_read) onRead();
      }}
    >
      <div className="comment-entry__head">
        <span className="comment-entry__name">
          {!comment.is_read && <span className="comment-entry__dot" aria-hidden="true" />}
          {comment.name}
        </span>
        <span className="comment-entry__time">{relativeTime(comment.created_at)}</span>
      </div>

      <a
        className="comment-entry__phone"
        href={telHref(comment.phone)}
        // Otherwise the tap bubbles to the article and re-triggers markRead —
        // harmless once read, but also steals focus from the actual phone link.
        onClick={(event) => event.stopPropagation()}
      >
        <PhoneIcon size={16} />
        {comment.phone}
      </a>

      <p className="comment-entry__message">{comment.message}</p>

      <button
        className="admin-btn admin-btn--ghost admin-btn--danger-text comment-entry__delete"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        O&apos;chirish
      </button>
    </article>
  );
}

export default function CommentsAdmin({ initialPage }: { initialPage: CommentsPage }) {
  const [comments, setComments] = useState(initialPage.comments);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [loadingMore, startLoadingMore] = useTransition();
  const [toDelete, setToDelete] = useState<Comment | null>(null);

  function loadMore() {
    const cursor = comments[comments.length - 1]?.created_at;
    if (!cursor) return;
    startLoadingMore(async () => {
      const page = await loadMoreComments(cursor);
      setComments((prev) => [...prev, ...page.comments]);
      setHasMore(page.hasMore);
    });
  }

  function markRead(id: string) {
    // Optimistic: the dot should disappear on click, not after the round trip.
    // markCommentRead's `.eq('is_read', false)` guard makes a stale double-fire
    // harmless.
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, is_read: true } : c)));
    const formData = new FormData();
    formData.set('id', id);
    void markCommentRead(formData);
  }

  return (
    <>
      <div className="admin__toolbar">
        <span className="admin__count">{comments.length} ta murojaat</span>
      </div>

      {comments.length === 0 && <p className="admin__empty">Hozircha murojaat yo&apos;q.</p>}

      <div className="comment-list">
        {comments.map((comment) => (
          <CommentEntry
            key={comment.id}
            comment={comment}
            onRead={() => markRead(comment.id)}
            onDelete={() => setToDelete(comment)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="admin__toolbar">
          <button
            className="admin-btn admin-btn--ghost"
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Yuklanmoqda…' : 'Yana yuklash'}
          </button>
        </div>
      )}

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} labelledBy={MODAL_TITLE_ID}>
        {toDelete && (
          <CommentDeleteDialog
            comment={toDelete}
            titleId={MODAL_TITLE_ID}
            onCancel={() => setToDelete(null)}
            onDeleted={(id) => {
              setComments((prev) => prev.filter((c) => c.id !== id));
              setToDelete(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
