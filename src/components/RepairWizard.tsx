'use client';

import { useState } from 'react';
import { Arrow, Icon } from './Icon';
import { Progress } from './Progress';
import { IC } from '@/lib/icons';
import { CONTACT, REPAIR_CATEGORIES, REPAIR_LOCATIONS, REPAIR_STEPS, REPAIR_URGENCIES } from '@/lib/content';
import { submitRepair } from '@/lib/forms';

interface Rep {
  step: number;
  cat: string;
  urg: string;
  loc: string;
  desc: string;
  name: string;
  phone: string;
  address: string;
}
const FRESH: Rep = { step: 0, cat: '', urg: '', loc: '', desc: '', name: '', phone: '', address: '' };

const Back = ({ onClick, small }: { onClick: () => void; small?: boolean }) => (
  <button type="button" className="btn btn--ghost" style={small ? { minHeight: 44 } : undefined} onClick={onClick}>
    <Icon d={IC.arrowLeft} size={16} stroke={2.4} round={false} />
    Back
  </button>
);

export function RepairWizard() {
  const [r, setR] = useState<Rep>(FRESH);
  const [photos, setPhotos] = useState<File[]>([]);
  const [sentRef, setSentRef] = useState<string | null>(null);
  const set = (patch: Partial<Rep>) => setR((x) => ({ ...x, ...patch }));
  const field = (k: 'desc' | 'name' | 'phone' | 'address') => ({
    value: r[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [k]: e.target.value }),
  });

  const can = [!!r.cat, !!r.urg, r.desc.trim().length > 0, !!(r.name.trim() && r.phone.trim() && r.address.trim())][r.step];
  const summary = [
    ['Issue', r.cat],
    ['Urgency', r.urg],
    ['Where', r.loc],
  ].map(([label, value]) => ({ label, value: value || '—' }));

  const next = async () => {
    if (!can) return;
    if (r.step < 3) return set({ step: r.step + 1 });
    const { ref } = await submitRepair({ ...r, photos: photos.map((f) => f.name) });
    setSentRef(ref);
    window.scrollTo(0, 0);
  };

  if (sentRef) {
    return (
      <div className="done" style={{ maxWidth: 720 }}>
        <span className="icon-tile icon-tile--56">
          <Icon d={IC.check} size={28} stroke={2.6} round={false} />
        </span>
        <h1 className="h-done">Repair reported.</h1>
        <p>We’ll review it and call you to arrange the repair or an inspection. Quote your reference if you call.</p>
        <div className="done__box">
          <div className="done__ref">
            <span>Reference</span>
            <strong>{sentRef}</strong>
          </div>
          {summary.map((s) => (
            <div key={s.label} className="done__row">
              <span>{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
        <div>
          <button
            type="button"
            className="btn btn--outline btn--md"
            style={{ padding: '0 16px' }}
            onClick={() => {
              setSentRef(null);
              setR(FRESH);
              setPhotos([]);
            }}
          >
            Report another issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="repair-grid">
      <div className="repair-main">
        <Progress steps={REPAIR_STEPS} current={r.step} />

        {r.step === 0 && (
          <div className="step">
            <h1 className="h-step">What needs fixing?</h1>
            <div className="cats">
              {REPAIR_CATEGORIES.map(([label, icon]) => (
                <button key={label} type="button" className="cat" aria-pressed={r.cat === label} onClick={() => set({ cat: label, step: 1 })}>
                  <Icon d={icon} size={26} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {r.step === 1 && (
          <div className="step">
            <h1 className="h-step">How urgent is it?</h1>
            <div role="radiogroup" aria-label="Urgency" className="urgs">
              {REPAIR_URGENCIES.map(([label, hint]) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={r.urg === label}
                  data-emergency={label === 'Emergency'}
                  className="urg"
                  onClick={() => set({ urg: label, step: label === 'Emergency' ? 1 : 2 })}
                >
                  <span className="urg__box"><i /></span>
                  <span className="urg__txt">
                    <span className="urg__label">{label}</span>
                    <span className="urg__hint">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
            {r.urg === 'Emergency' && (
              <div role="alert" className="emerg-alert">
                <p className="emerg-alert__h">Please call us now.</p>
                <p className="emerg-alert__p">
                  If there’s a smell of gas, call the National Gas Emergency line on 0800 111 999. If anyone is in danger, call 999.
                </p>
                <div className="btn-row">
                  <a href={CONTACT.tel} className="btn emerg-alert__call">
                    Call {CONTACT.phone}
                  </a>
                  <button type="button" className="btn btn--on-accent" style={{ padding: '0 16px', fontSize: 15 }} onClick={() => set({ step: 2 })}>
                    I’ve called — log it online too
                  </button>
                </div>
              </div>
            )}
            <div>
              <Back small onClick={() => set({ step: 0 })} />
            </div>
          </div>
        )}

        {r.step === 2 && (
          <div className="step step--22">
            <h1 className="h-step-sm">Tell us more</h1>
            <div className="field" role="group" aria-labelledby="loc-label">
              <span className="loc-label" id="loc-label">Where in the home?</span>
              <div className="chip-row chip-row--tight">
                {REPAIR_LOCATIONS.map((v) => (
                  <button key={v} type="button" className="chip chip--lg" aria-pressed={r.loc === v} onClick={() => set({ loc: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <label className="field field--tight">
              <span className="field__label field__label--soft">Describe the problem</span>
              <textarea rows={5} className="input" placeholder="When did it start, and is anything damaged?" {...field('desc')} />
            </label>
            <label className="upload">
              <b>Add photos</b>
              <span>{photos.length ? `${photos.length} selected` : 'optional — helps us bring the right parts'}</span>
              <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []))} />
            </label>
          </div>
        )}

        {r.step === 3 && (
          <div className="step step--22">
            <h1 className="h-step-sm">Your details</h1>
            <div className="grid-fields grid-fields--240">
              <label className="field field--tight">
                <span className="field__label field__label--soft">Full name</span>
                <input className="input" autoComplete="name" {...field('name')} />
              </label>
              <label className="field field--tight">
                <span className="field__label field__label--soft">Phone</span>
                <input className="input" type="tel" autoComplete="tel" {...field('phone')} />
              </label>
            </div>
            <label className="field field--tight">
              <span className="field__label field__label--soft">Property address</span>
              <input className="input" autoComplete="street-address" {...field('address')} />
            </label>
          </div>
        )}

        {r.step > 1 && (
          <div className="wiz-nav">
            <Back onClick={() => set({ step: Math.max(0, r.step - 1) })} />
            <button type="button" className="btn btn--primary" aria-disabled={!can} onClick={next}>
              {r.step === 3 ? 'Send repair request' : 'Continue'} <Arrow />
            </button>
          </div>
        )}
      </div>

      <aside className="summary" aria-label="Your request">
        <p className="eyebrow eyebrow--muted">Your request</p>
        {summary.map((s) => (
          <div key={s.label} className="summary__row">
            <span>{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
        <p className="summary__note">All information is kept confidential and used only to arrange the repair.</p>
      </aside>
    </div>
  );
}
