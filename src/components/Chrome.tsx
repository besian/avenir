'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from './Logo';
import { CONTACT, FOOTER_EXPLORE, FOOTER_HELP } from '@/lib/content';

/** "Not sure where to start?" banner — hidden on the form-led pages. */
export function ClosingBanner() {
  const pathname = usePathname();
  if (['/contact', '/apply', '/repair'].includes(pathname)) return null;
  return (
    <section className="closer">
      <div className="wrap closer__in">
        <h2>Not sure where to start? Talk to us.</h2>
        <div className="btn-row">
          <a href={CONTACT.tel} className="btn btn--paper">
            Call {CONTACT.phone}
          </a>
          <Link href="/contact" className="btn btn--on-accent" style={{ padding: '0 18px' }}>
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div className="footer__brand">
          <span role="img" aria-label="Avenir Housing" className="logo">
            <LogoMark />
          </span>
          <p>Safe, supported accommodation for vulnerable adults.</p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__h">Explore</p>
            {FOOTER_EXPLORE.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <p className="footer__h">Get help</p>
            {FOOTER_HELP.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <p className="footer__h">Contact</p>
            <a href={CONTACT.tel}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.address}</span>
          </div>
        </div>
      </div>
      <div className="footer__legal">
        <div className="wrap footer__legal-in">
          <span>© Avenir Housing CIC</span>
          {/* TODO: point at the real privacy policy page */}
          <a href="#">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
}
