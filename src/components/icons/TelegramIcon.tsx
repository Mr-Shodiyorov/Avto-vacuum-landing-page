interface Props {
  size?: number;
  color?: string;
}

export default function TelegramIcon({ size = 20, color = '#fff' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" fill={color} />
    </svg>
  );
}
