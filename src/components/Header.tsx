'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { useUI } from './UIProvider';
import { IC } from '@/lib/icons';
import { CONTACT, NAV_LINKS } from '@/lib/content';

export function Header() {
  const pathname = usePathname();
  const { openPalette } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Expose on <html> so sticky elements (e.g. the properties filter bar) can follow the header height.
  useEffect(() => {
    document.documentElement.dataset.scrolled = String(scrolled);
  }, [scrolled]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="hdr" data-scrolled={scrolled}>
      <div className="topbar">
        <div className="wrap topbar__in">
          <span className="topbar__grp">
            <span className="topbar__q">Already a tenant?</span>
            <Link href="/repair" className="topbar__btn topbar__btn--start">
              <Icon d={IC.wrench} size={14} />
              Request a repair
            </Link>
          </span>
          <span className="topbar__grp">
            <span className="topbar__q">Emergency or risk to safety?</span>
            <a href={CONTACT.tel} className="topbar__btn topbar__btn--end">
              <Icon d={IC.phone} size={14} />
              {CONTACT.phone}
            </a>
          </span>
        </div>
      </div>
      <div className="wrap hdr__bar">
        <Logo />
        <nav aria-label="Main" className="nav hdr__desktop">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav__link" aria-current={isCurrent(l.href) ? 'page' : undefined}>
              {l.label}
              <span className="nav__dot" />
            </Link>
          ))}
        </nav>
        <button type="button" onClick={openPalette} aria-label="Search (⌘K)" title="Search (⌘K)" className="nav__search hdr__desktop">
          <Icon d={IC.search} size={18} stroke={2.2} />
        </button>
        <div className="hdr__mobile">
          <button type="button" onClick={openPalette} aria-label="Search" className="m-search">
            <Icon d={IC.search} size={18} stroke={2.2} />
          </button>
          <button type="button" onClick={openPalette} className="m-menu">
            <Icon d={IC.menu} size={16} stroke={2.2} />
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
