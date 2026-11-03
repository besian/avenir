'use client';

import { useState } from 'react';
import { Arrow } from './Icon';
import { submitLandlordEnquiry } from '@/lib/forms';

const BEDS = ['1–2', '3', '4', '5+'];
type F = { name?: string; email?: string; phone?: string; postcode?: string; beds?: string };

export function LandlordForm() {
  const [f, setF] = useState<F>({});
  const [sent, setSent] = useState(false);
  const bind = (k: keyof F) => ({ value: f[k] || '', onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value })) });

  if (sent) {
    return (
      <div className="sent" role="status">
        <span className="sent__sq" />
        <h3>Thanks — we’ll be in touch.</h3>
        <p>Someone from the team will call within two working days to talk about your property.</p>
        <div>
          <button type="button" className="btn btn--outline btn--sm" style={{ padding: '0 14px' }} onClick={() => { setSent(false); setF({}); }}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        await submitLandlordEnquiry({ ...f, postcode: f.postcode?.toUpperCase() });
        setSent(true);
      }}
    >
      <h3>Tell us about your property</h3>
      <p className="form__sub">Two minutes. No commitment.</p>
      <label className="field field--tight">
        <span className="field__label field__label--soft">Name</span>
        <input className="input" required autoComplete="name" {...bind('name')} />
      </label>
      <div className="grid-fields grid-fields--180">
        <label className="field field--tight">
          <span className="field__label field__label--soft">Email</span>
          <input className="input" type="email" required autoComplete="email" {...bind('email')} />
        </label>
        <label className="field field--tight">
          <span className="field__label field__label--soft">Phone</span>
          <input className="input" type="tel" autoComplete="tel" {...bind('phone')} />
        </label>
      </div>
      <label className="field field--tight">
        <span className="field__label field__label--soft">Property postcode</span>
        <input className="input input--upper" required placeholder="e.g. SW16 3QL" autoComplete="postal-code" {...bind('postcode')} />
      </label>
      <div className="field" role="group" aria-labelledby="ll-beds">
        <span className="loc-label" id="ll-beds">Bedrooms</span>
        <div className="chip-row chip-row--tight">
          {BEDS.map((v) => (
            <button key={v} type="button" className="chip chip--sq" aria-pressed={f.beds === v} onClick={() => setF((x) => ({ ...x, beds: v }))}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn--primary btn--block" style={{ padding: '0 18px', marginTop: 4, gap: 12 }}>
        Send <Arrow />
      </button>
    </form>
  );
}
