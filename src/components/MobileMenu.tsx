'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Arrow, Icon } from './Icon';
import { LogoMark } from './Logo';
import { IC } from '@/lib/icons';
import { CONTACT, HREF, NAV_LINKS } from '@/lib/content';
import { useModal } from '@/lib/useModal';

interface Props {
  onClose: () => void;
  onSearch: () => void;
  isCurrent: (href: string) => boolean;
}

/** Full-screen phone menu. Rendered in a portal so the header's backdrop-filter can't trap it. */
export function MobileMenu({ onClose, onSearch, isCurrent }: Props) {
  useModal(onClose);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);

  return createPortal(
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="mmenu">
      <div className="wrap mmenu__top">
        <Link href="/" className="logo" onClick={onClose} aria-label="Avenir Housing home">
          <LogoMark />
        </Link>
        <button ref={closeRef} type="button" className="m-icon m-icon--end" onClick={onClose} aria-label="Close menu">
          <Icon d={IC.close} size={24} />
        </button>
      </div>

      <div className="wrap mmenu__body">
        <button
          type="button"
          className="mmenu__search"
          onClick={() => {
            onClose();
            onSearch();
          }}
        >
          <Icon d={IC.search} size={18} stroke={2.2} color="var(--color-neutral-700)" />
          Search homes, help and pages
        </button>

        <nav aria-label="Main" className="mmenu__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose} aria-current={isCurrent(l.href) ? 'page' : undefined}>
              {l.label}
              <Arrow size={20} />
            </Link>
          ))}
        </nav>

        <div className="mmenu__tenant">
          <p className="eyebrow eyebrow--muted">Already a tenant?</p>
          <Link href="/repair" onClick={onClose} className="mmenu__row">
            <Icon d={IC.wrench} size={20} color="var(--color-accent)" />
            Report a repair
          </Link>
          <Link href="/support#complaints" onClick={onClose} className="mmenu__row">
            <Icon d={IC.message} size={20} color="var(--color-accent)" />
            Make a complaint
          </Link>
        </div>

        <div className="mmenu__ctas">
          <Link href={HREF.refer} onClick={onClose} className="btn btn--primary btn--block">
            Make a referral <Arrow />
          </Link>
          <a href={CONTACT.tel} className="btn btn--outline btn--block">
            Call {CONTACT.phone}
            <Icon d={IC.phone} size={16} />
          </a>
          <p className="mmenu__note">Emergency or risk to safety? Call us now.</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
