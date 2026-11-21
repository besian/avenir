import type { CSSProperties, ReactNode } from 'react';

interface Props {
  /** Image URL. When absent, a striped placeholder with `label` is shown. */
  src?: string;
  alt?: string;
  label?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Load immediately (for images visible on page load). */
  eager?: boolean;
  children?: ReactNode;
}

/**
 * Photo slot. Renders the image when `src` is given, otherwise the striped
 * placeholder used throughout the design. Swap real photos in by passing src.
 */
export function Photo({ src, alt = '', label, className = '', style, children, eager }: Props) {
  return (
    <div className={`ph ${className}`} style={style}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        label && <span className="ph__label">{label}</span>
      )}
      {children}
    </div>
  );
}
