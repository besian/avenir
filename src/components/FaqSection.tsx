'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from './Icon';
import { IC } from '@/lib/icons';
import { FAQS } from '@/lib/content';

export function FaqSection() {
  const [open, setOpen] = useState(0);
  const [q, setQ] = useState('');
  const query = q.toLowerCase().trim();
  const items = FAQS.map((f, i) => ({ ...f, i })).filter(
    (f) => !query || `${f.q} ${f.a} ${(f.bullets || []).join(' ')}`.toLowerCase().includes(query),
  );

  return (
    <section className="rule-top">
      <div className="wrap section-pad faq">
        <div className="faq__side">
          <p className="eyebrow">Questions</p>
          <h2 className="h-section">FAQs</h2>
          <label className="searchbox">
            <Icon d={IC.search} size={18} stroke={2.2} color="var(--color-neutral-700)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label="Search questions" />
          </label>
          <p className="faq__note">
            Can’t find it? <Link href="/contact">Get in touch</Link> — we reply promptly and confidentially.
          </p>
        </div>
        <div style={{ minWidth: 0 }}>
          {items.length === 0 && <p className="faq__empty">No questions match “{q}”.</p>}
          {items.map((f) => {
            const isOpen = query ? true : open === f.i;
            const id = `faq-${f.i}`;
            return (
              <div key={f.i} className="faq__item">
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => {
                    setOpen(open === f.i && !query ? -1 : f.i);
                    setQ('');
                  }}
                >
                  <span>{f.q}</span>
                  <span className="faq__sign" aria-hidden="true">{isOpen ? '–' : '+'}</span>
                </button>
                {isOpen && (
                  <div id={id} className="faq__a">
                    <p>{f.a}</p>
                    {(f.bullets || []).map((b) => (
                      <div key={b} className="bullet">
                        <i />
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="faq__item" />
        </div>
      </div>
    </section>
  );
}
