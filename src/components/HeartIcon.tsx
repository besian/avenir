import { IC } from '@/lib/icons';

/** Heart outline; filled via CSS when its button is aria-pressed. */
export function HeartIcon({ size = 20, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={size < 18 ? 2.2 : 2} strokeLinejoin="round" aria-hidden="true">
      <path d={IC.heart} />
    </svg>
  );
}
