import type { CSSProperties } from 'react';

interface Props {
  d: string;
  size?: number;
  stroke?: number;
  color?: string;
  fill?: string;
  round?: boolean;
  style?: CSSProperties;
  className?: string;
}

/** Inline Lucide-style stroke icon from a single path string. */
export function Icon({ d, size = 16, stroke = 2, color = 'currentColor', fill = 'none', round = true, style, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap={round ? 'round' : undefined}
      strokeLinejoin={round ? 'round' : undefined}
      aria-hidden="true"
      focusable="false"
      style={style}
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

const ARROW = 'M5 12h14M12 5l7 7-7 7';
export const Arrow = ({ size = 16 }: { size?: number }) => (
  <Icon d={ARROW} size={size} stroke={2.4} round={false} />
);
