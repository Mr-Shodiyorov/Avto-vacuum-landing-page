// TODO: replace with a real photo via `next/image` once site photography is
// available. Kept as a lightweight inline placeholder (no network request) so
// layout/CLS can be reviewed before assets land.
import './image-placeholder.css';

interface Props {
  label: string;
  ratio?: string;
  radius?: string;
  tag?: string;
  className?: string;
}

export default function ImagePlaceholder({
  label,
  ratio = '4 / 3',
  radius = '0',
  tag,
  className,
}: Props) {
  return (
    <div
      className={['img-placeholder', className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio, borderRadius: radius }}
      role="img"
      aria-label={label}
    >
      {tag && (
        <span
          className="img-placeholder__tag"
          style={{
            background: tag === 'OLDIN' ? 'rgba(16,26,40,.78)' : 'var(--color-accent)',
          }}
        >
          {tag}
        </span>
      )}
      <span className="img-placeholder__label">{label}</span>
    </div>
  );
}
