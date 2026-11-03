import Link from 'next/link';

export function LogoMark() {
  return (
    <span className="logo__in">
      <svg viewBox="0 0 40 40" className="logo__mark" aria-hidden="true">
        <path fill="none" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M4.5 22.5L20 8L35.5 22.5" />
        <circle fill="var(--color-accent)" cx="20" cy="31" r="6" />
      </svg>
      <span className="logo__word">
        <span className="logo__a">avenir</span>
        <span className="logo__h">housing</span>
      </span>
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" aria-label="Avenir Housing home" className="logo">
      <LogoMark />
    </Link>
  );
}
