import './logo.css';

interface Props {
  size?: number;
  innerBg?: string;
  textColor?: string;
  ringA?: string;
  ringB?: string;
}

export default function Logo({
  size = 46,
  innerBg = '#fff',
  textColor = '#0B4A8F',
  ringA = '#0B4A8F',
  ringB = '#F5871F',
}: Props) {
  const innerSize = Math.round(size * 0.696);
  const fontSize = Math.round(size * 0.283);
  const gradient = `conic-gradient(${ringA} 0 45deg, ${ringB} 45deg 90deg, ${ringA} 90deg 135deg, ${ringB} 135deg 180deg, ${ringA} 180deg 225deg, ${ringB} 225deg 270deg, ${ringA} 270deg 315deg, ${ringB} 315deg 360deg)`;

  return (
    <span
      className="logo-mark"
      style={{ width: size, height: size, background: gradient }}
      aria-hidden="true"
    >
      <span
        className="logo-mark__inner"
        style={{
          width: innerSize,
          height: innerSize,
          background: innerBg,
          color: textColor,
          fontSize,
        }}
      >
        AV
      </span>
    </span>
  );
}
