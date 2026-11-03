'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { IC } from '@/lib/icons';
import { CONTACT, HREF } from '@/lib/content';
import { PROPERTIES, propertyHref } from '@/lib/properties';

interface Intent {
  label: string;
  hint: string;
  icon: string;
  kw: string;
  href: string;
}

const INTENTS: Intent[] = [
  { label: 'Find an available home', hint: 'Properties', icon: IC.home, kw: 'property house room flat available search', href: '/properties' },
  { label: 'Apply for accommodation', hint: 'For myself', icon: IC.user, kw: 'apply need home myself homeless', href: HREF.applySelf },
  { label: 'Refer someone', hint: 'Councils, agencies, charities', icon: IC.userPlus, kw: 'referral refer council agency charity', href: HREF.refer },
  { label: 'Report a repair', hint: 'Tenants', icon: IC.wrench, kw: 'repair fix broken maintenance leak heating', href: '/repair' },
  { label: 'Emergency — call now', hint: CONTACT.phone, icon: IC.alert, kw: 'emergency urgent danger flood gas safety call phone', href: CONTACT.tel },
  { label: 'Let your property to us', hint: 'Landlords & partners', icon: IC.building, kw: 'landlord partner let property work', href: '/landlords' },
  { label: 'Support we offer', hint: 'Budgeting, health, life skills', icon: IC.shield, kw: 'support help budgeting benefits mental health', href: '/support' },
  { label: 'Make a complaint', hint: 'How we handle it', icon: IC.message, kw: 'complaint unhappy problem', href: '/support#complaints' },
  { label: 'Contact us', hint: 'Call, email or visit', icon: IC.mail, kw: 'contact email call address visit', href: '/contact' },
  ...PROPERTIES.map((p) => ({
    label: p.title,
    hint: `${p.area} · ${p.avail}`,
    icon: IC.pin,
    kw: `home property ${p.area} ${p.type}`,
    href: propertyHref(p),
  })),
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => {
    returnFocus.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const all = terms.length
      ? INTENTS.filter((it) => terms.every((t) => `${it.label} ${it.hint} ${it.kw}`.toLowerCase().includes(t)))
      : INTENTS;
    return all.slice(0, 9);
  }, [q]);

  const sel = Math.min(idx, Math.max(0, results.length - 1));

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const run = (it: Intent) => {
    onClose();
    if (it.href.startsWith('tel:')) window.location.href = it.href;
    else router.push(it.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx(Math.min(results.length - 1, sel + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx(Math.max(0, sel - 1));
    } else if (e.key === 'Enter' && results[sel]) {
      e.preventDefault();
      run(results[sel]);
    }
  };

  return (
    <div className="pal-backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search or jump to" className="pal" onClick={(e) => e.stopPropagation()}>
        <div className="pal__head">
          <Icon d={IC.search} size={20} stroke={2.4} color="var(--color-accent)" />
          <input
            autoFocus
            className="pal__input"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={onKey}
            placeholder="Try “repair”, “refer” or “Streatham”"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="pal-list"
            aria-activedescendant={results[sel] ? `pal-opt-${sel}` : undefined}
          />
          <button type="button" onClick={onClose} className="pal__esc">
            Esc
          </button>
        </div>
        <div role="listbox" id="pal-list" className="pal__list" ref={listRef}>
          {results.length === 0 && (
            <p className="pal__empty">
              Nothing found. Call <a href={CONTACT.tel}>{CONTACT.phone}</a> and we’ll help.
            </p>
          )}
          {results.map((r, i) => (
            <button
              type="button"
              key={r.label}
              id={`pal-opt-${i}`}
              data-i={i}
              role="option"
              aria-selected={i === sel}
              className="pal__opt"
              onClick={() => run(r)}
              onMouseEnter={() => setIdx(i)}
            >
              <Icon d={r.icon} size={20} color="var(--color-accent)" style={{ flex: 'none' }} />
              <span className="pal__txt">
                <b>{r.label}</b>
                <span>{r.hint}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="pal__foot">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
