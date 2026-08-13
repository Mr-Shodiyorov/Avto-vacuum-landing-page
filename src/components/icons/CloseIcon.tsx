interface Props {
  size?: number;
  color?: string;
}

export default function CloseIcon({ size = 20, color = '#101A28' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4.5 4.5l11 11M15.5 4.5l-11 11"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
