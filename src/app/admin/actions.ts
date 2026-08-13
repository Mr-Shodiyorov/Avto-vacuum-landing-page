'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getCards } from '@/lib/cards';
import { type CommentsPage, getComments } from '@/lib/comments';
import { createSession, destroySession, isCorrectPassword, requireSession } from '@/lib/session';
import { STORAGE_BUCKET } from '@/lib/storage';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Every mutation behind /admin.
 *
 * Server Actions are ordinary POST endpoints — anyone can craft a request to
 * one. `proxy.ts` guards page navigations, but per the Next.js docs a matcher
 * change can silently drop that coverage
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:219),
 * so every action below re-checks the session itself with `requireSession()`
 * before touching Supabase. That check, not the proxy, is the security boundary.
 */

export interface ActionState {
  error?: string;
  ok?: boolean;
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

/** Pushes fresh HTML to the public page and the admin list after a change. */
function revalidateEverything(): void {
  revalidatePath('/'); // the landing page's cached ISR output
  revalidatePath('/admin'); // the admin list itself
}

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

export async function login(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get('password') ?? '');

  if (!password || !isCorrectPassword(password)) {
    // Deliberately vague: no "user not found", no "password too short", nothing
    // that narrows the search space.
    return { error: "Parol noto'g'ri" };
  }

  await createSession();

  // Invalidate the client-side router cache before leaving, then redirect from
  // the server. A bare client-side router.push() would re-show the cached
  // logged-out shell on Vercel until a hard refresh; this pair does not.
  revalidatePath('/admin', 'layout');
  redirect('/admin'); // throws NEXT_REDIRECT — nothing after this line runs
}

export async function logout(): Promise<void> {
  await destroySession();
  revalidatePath('/admin', 'layout');
  redirect('/');
}

// -----------------------------------------------------------------------------
// Image upload
// -----------------------------------------------------------------------------

export interface UploadTicket {
  path: string;
  token: string;
}

/**
 * Mints a one-shot signed upload URL so the browser can PUT the image directly
 * to Supabase Storage.
 *
 * Why not just POST the file to this Server Action? Vercel caps a serverless
 * function's request body at 4.5 MB, which is under the 5 MB limit this panel
 * promises — and phone photos land in that range routinely. Going straight to
 * Storage sidesteps the cap, halves the bytes on the wire, and still keeps the
 * service role key on the server: the browser only ever sees a token scoped to
 * one path in one bucket.
 */
export async function createUploadTicket(extension: string): Promise<UploadTicket> {
  await requireSession();

  const ext = extension.toLowerCase().replace(/^\./, '');
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    throw new Error(`Rasm formati qo'llab-quvvatlanmaydi: .${ext}`);
  }

  // Random name: never trust a client-supplied filename as a storage path.
  const path = `${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(error?.message ?? 'Yuklash uchun ruxsat olinmadi');
  }

  return { path: data.path, token: data.token };
}

/**
 * Turns a public Storage URL back into its object path, or null if the URL does
 * not belong to our bucket. Used to clean up replaced/deleted images.
 */
function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
}

/** Best-effort delete. A missing file must not fail the surrounding mutation. */
async function removeImages(urls: (string | null)[]): Promise<void> {
  const paths = urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;

  const { error } = await supabaseAdmin().storage.from(STORAGE_BUCKET).remove(paths);
  if (error) {
    console.error('[storage] failed to remove', paths, error);
  }
}

// -----------------------------------------------------------------------------
// Card CRUD
// -----------------------------------------------------------------------------

export async function saveCard(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const beforeLabel = String(formData.get('before_label') ?? '').trim();
  const afterLabel = String(formData.get('after_label') ?? '').trim();
  const meta = String(formData.get('meta') ?? '').trim();
  // Set by the client once a direct-to-Storage upload finished; otherwise these
  // carry the card's existing URLs unchanged.
  const beforeImageUrl = String(formData.get('before_image_url') ?? '').trim() || null;
  const afterImageUrl = String(formData.get('after_image_url') ?? '').trim() || null;

  if (!title) {
    return { error: 'Sarlavha kiritilishi shart' };
  }

  const db = supabaseAdmin();
  const row = {
    title,
    before_label: beforeLabel,
    after_label: afterLabel,
    meta,
    before_image_url: beforeImageUrl,
    after_image_url: afterImageUrl,
  };

  if (id) {
    // Replacing an image leaves the old object behind unless we delete it here.
    const { data: existing } = await db
      .from('before_after_cards')
      .select('before_image_url, after_image_url')
      .eq('id', id)
      .single();

    const { error } = await db.from('before_after_cards').update(row).eq('id', id);
    if (error) return { error: `Saqlashda xatolik: ${error.message}` };

    if (existing) {
      const replaced = [
        existing.before_image_url !== beforeImageUrl ? existing.before_image_url : null,
        existing.after_image_url !== afterImageUrl ? existing.after_image_url : null,
      ];
      await removeImages(replaced);
    }
  } else {
    // New cards go to the end of the list.
    const { data: last } = await db
      .from('before_after_cards')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await db
      .from('before_after_cards')
      .insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 });
    if (error) return { error: `Qo'shishda xatolik: ${error.message}` };
  }

  revalidateEverything();
  return { ok: true };
}

export async function deleteCard(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const db = supabaseAdmin();

  // Read the URLs first: once the row is gone we can no longer find its files,
  // which is exactly how orphaned images accumulate.
  const { data: existing } = await db
    .from('before_after_cards')
    .select('before_image_url, after_image_url')
    .eq('id', id)
    .single();

  const { error } = await db.from('before_after_cards').delete().eq('id', id);
  if (error) {
    console.error('[before_after_cards] delete failed:', error);
    return;
  }

  await removeImages([existing?.before_image_url ?? null, existing?.after_image_url ?? null]);
  revalidateEverything();
}

export async function moveCard(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get('id') ?? '').trim();
  const direction = String(formData.get('direction') ?? '');
  if (!id || (direction !== 'up' && direction !== 'down')) return;

  const cards = await getCards();
  const index = cards.findIndex((card) => card.id === id);
  if (index === -1) return;

  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= cards.length) return; // already at the edge

  const reordered = [...cards];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  // Renumber the whole list rather than swapping two values. It costs one extra
  // update per card and it repairs duplicate or zeroed sort_order values —
  // including the ones the seed data would produce if you edited it by hand.
  const db = supabaseAdmin();
  const updates = reordered.map((card, i) =>
    db.from('before_after_cards').update({ sort_order: i + 1 }).eq('id', card.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    console.error('[before_after_cards] reorder failed:', failed.error);
    return;
  }

  revalidateEverything();
}

// -----------------------------------------------------------------------------
// Comment moderation
// -----------------------------------------------------------------------------
// Comments never appear on the public page, so these only ever need to
// revalidate '/admin' — never the '/' the card mutations above also touch.

export async function markCommentRead(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const { error } = await supabaseAdmin()
    .from('comments')
    .update({ is_read: true })
    .eq('id', id)
    .eq('is_read', false); // already-read rows skip a needless write

  if (error) {
    console.error('[comments] mark read failed:', error);
    return;
  }

  revalidatePath('/admin');
}

export async function deleteComment(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const { error } = await supabaseAdmin().from('comments').delete().eq('id', id);
  if (error) {
    console.error('[comments] delete failed:', error);
    return;
  }

  revalidatePath('/admin');
}

/** Fetches the next page for the "Yana yuklash" button in CommentsAdmin. */
export async function loadMoreComments(cursor: string): Promise<CommentsPage> {
  return getComments(cursor);
}
