/**
 * Storage constants shared by server and browser code.
 *
 * Kept out of `src/lib/supabase.ts` on purpose: that file is `server-only`
 * because it holds the service role key, so the admin form — a Client Component
 * — cannot import from it.
 *
 * These limits are enforced in three places, deliberately: here in the browser
 * for a fast error message, in `createUploadTicket` for the file extension, and
 * on the bucket itself (`file_size_limit` / `allowed_mime_types` in
 * supabase/migrations/001_before_after_cards.sql) so a crafted request cannot
 * get around the first two.
 */

export const STORAGE_BUCKET = 'before-after-images';

/** 5 MB, matching the bucket's `file_size_limit`. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** For the file picker's `accept` attribute. */
export const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
