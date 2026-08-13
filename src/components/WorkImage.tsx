import Image from 'next/image';

import ImagePlaceholder from '@/components/ImagePlaceholder';

import './work-image.css';

interface Props {
  /** Public Supabase Storage URL, or null while no photo has been uploaded. */
  src: string | null;
  /** Descriptive text shown in the bottom bar, e.g. "OLDIN — iflos salon". */
  label: string;
  tag: 'OLDIN' | 'KEYIN';
  ratio?: string;
  /** Adds a click target that opens the photo in <Lightbox>. */
  zoomable?: boolean;
}

/**
 * One half of a before/after pair. Falls back to the striped placeholder when
 * the card has no photo yet, so a half-filled card still looks intentional.
 *
 * The badge and label reuse the `.img-placeholder__*` classes on purpose: the
 * hover choreography in `before-after.css` targets those class names, so the
 * "before recedes / after steps up" effect works for photos and placeholders
 * alike.
 */
export default function WorkImage({
  src,
  label,
  tag,
  ratio = '1 / 1',
  zoomable = false,
}: Props) {
  if (!src) {
    return <ImagePlaceholder label={label} tag={tag} ratio={ratio} />;
  }

  return (
    <div className="work-image" style={{ aspectRatio: ratio }}>
      <Image
        className="work-image__img"
        src={src}
        alt={label}
        fill
        // Two images per card: ~200px each in the 3-up desktop grid, half the
        // viewport on phones.
        sizes="(min-width: 860px) 200px, 45vw"
      />
      <span
        className="img-placeholder__tag"
        style={{
          background: tag === 'OLDIN' ? 'rgba(16,26,40,.78)' : 'var(--color-accent)',
        }}
      >
        {tag}
      </span>
      <span className="img-placeholder__label">{label}</span>
      {zoomable && (
        // A real <button> so the photo is reachable by keyboard, not just by
        // mouse. <Lightbox> picks it up by delegation off `data-lightbox`, which
        // is why this component can stay a Server Component.
        <button
          className="work-image__zoom"
          type="button"
          data-lightbox={src}
          data-lightbox-alt={label}
          aria-label={`Kattalashtirish: ${label}`}
        />
      )}
    </div>
  );
}
