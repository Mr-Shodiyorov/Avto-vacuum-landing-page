interface Props {
  size?: number;
  color?: string;
}

export default function InstagramIcon({ size = 20, color = '#0B4A8F' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke={color} strokeWidth="1.8" />
      <circle cx="10" cy="10" r="3.6" stroke={color} strokeWidth="1.8" />
      <circle cx="14.6" cy="5.4" r="1.1" fill={color} />
    </svg>
  );
}
