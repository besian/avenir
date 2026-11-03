'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Arrow, Icon } from './Icon';
import { Progress } from './Progress';
import { IC } from '@/lib/icons';
import { APPLY_STEPS, CONTACT, CONTACT_PREFS, SITUATIONS } from '@/lib/content';
import { useLocalState } from '@/lib/storage';
import { submitApplication } from '@/lib/forms';

type Mode = 'self' | 'referral';
type Fields = 'refName' | 'refOrg' | 'refEmail' | 'name' | 'phone' | 'email' | 'needs' | 'pref' | 'situation';
interface Draft {
  step: number;
  mode: Mode;
  d: Partial<Record<Fields, string>> & { consent?: boolean };
}
const FRESH: Draft = { step: 0, mode: 'self', d: {} };

const top = () => window.scrollTo(0, 0);

export function ApplyWizard() {
  const [draft, setDraft, loaded] = useLocalState<Draft>('apply', FRESH);
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const handled = useRef<string | null>(null);

  // /apply?for=self|referral jumps straight to the details step in that mode.
  const forParam = params.get('for');
  useEffect(() => {
    if (!loaded || !forParam || handled.current === forParam) return;
    handled.current = forParam;
    if (forParam === 'self' || forParam === 'referral') {
      setSentRef(null);
      setDraft((a) => ({ ...a, mode: forParam, step: Math.max(1, a.step) }));
    }
    router.replace('/apply', { scroll: false });
  }, [loaded, forParam, setDraft, router]);

  const { step, mode, d } = draft;
  const isRef = mode === 'referral';
  const set = (patch: Partial<Draft>) => setDraft((a) => ({ ...a, ...patch }));
  const setD = (k: Fields | 'consent', v: string | boolean) => setDraft((a) => ({ ...a, d: { ...a.d, [k]: v } }));
  const field = (k: Fields) => ({ value: d[k] || '', onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD(k, e.target.value) });
  const filled = (k: Fields) => (d[k] || '').trim().length > 0;

  const okDetails = filled('name') && filled('phone') && (!isRef || (filled('refName') && filled('refOrg') && filled('refEmail')));
  const can = [true, okDetails, !!d.situation, !!d.consent][step];
  const hint = [
    '',
    isRef ? 'Add your details, plus the name and phone of the person you’re referring.' : 'Add your name and a phone number to continue.',
    'Choose the situation that fits best.',
    'Tick the consent box to send.',
  ][step];

  const next = async () => {
    if (!can || sending) return;
    if (step < 3) {
      set({ step: step + 1 });
      top();
      return;
    }
    setSending(true);
    try {
      const { ref } = await submitApplication({ mode, ...d });
      setDraft({ ...FRESH, mode });
      setSentRef(ref);
      top();
    } finally {
      setSending(false);
    }
  };

  if (sentRef) {
    return (
      <div className="done">
        <span className="icon-tile icon-tile--56">
          <Icon d={IC.check} size={28} stroke={2.6} round={false} />
        </span>
        <h1 className="h-done">{isRef ? 'Referral sent.' : 'Application sent.'}</h1>
        <p>A member of the team will call within two working days. Everything shared is kept confidential.</p>
        <div className="done__box">
          <div className="done__ref">
            <span>Your reference</span>
            <strong>{sentRef}</strong>
          </div>
          <div className="done__next">
            <p style={{ fontWeight: 700 }}>What happens next</p>
            <p>1 · We review the details and check we can meet the person’s needs.</p>
            <p>2 · We call to talk it through and arrange a visit.</p>
            <p>3 · If it’s a good fit, we agree a move-in date together.</p>
          </div>
        </div>
        <div className="btn-row">
          <Link href="/properties" className="btn btn--primary btn--md">
            Browse homes
          </Link>
          <button type="button" onClick={() => setSentRef(null)} className="btn btn--outline btn--md" style={{ padding: '0 16px' }}>
            Start another
          </button>
        </div>
      </div>
    );
  }

  const review = [
    ...(isRef ? [{ label: 'Referrer', value: [d.refName, d.refOrg, d.refEmail].filter(Boolean).join(' · '), step: 1 }] : []),
    { label: isRef ? 'Person referred' : 'Name', value: d.name || '—', step: 1 },
    { label: 'Phone', value: d.phone || '—', step: 1 },
    { label: 'Email', value: d.email || 'Not given', step: 1 },
    { label: 'Best way to reach', value: d.pref || 'Phone call', step: 1 },
    { label: 'Situation', value: d.situation || '—', step: 2 },
    { label: 'Support needs', value: d.needs || 'Not given', step: 2 },
  ];

  return (
    <>
      <Progress
        steps={APPLY_STEPS}
        current={step}
        aside={
          step > 0 && (
            <span className="draft-note">
              Progress saved on this device
              <button type="button" className="link-btn" onClick={() => setDraft(FRESH)}>
                Clear
              </button>
            </span>
          )
        }
      />

      {step === 0 && (
        <div className="step">
          <h1 className="h-step">Who is this for?</h1>
          <p className="step__lead">
            You can apply directly or be referred by a local authority, support agency or charity. It takes about five minutes.
          </p>
          <div className="modes">
            {(
              [
                ['self', 'Myself', 'I need somewhere safe to live', IC.user],
                ['referral', 'Someone I’m referring', 'I work for a council, agency or charity', IC.userPlus],
              ] as const
            ).map(([v, label, h, icon]) => (
              <button key={v} type="button" className="mode" aria-pressed={mode === v} onClick={() => set({ mode: v, step: 1 })}>
                <span className="icon-tile icon-tile--48">
                  <Icon d={icon} size={22} />
                </span>
                <span className="mode__label">{label}</span>
                <span className="mode__hint">{h}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-neutral-800)' }}>
            Prefer to talk? Call <a href={CONTACT.tel}>{CONTACT.phone}</a> and we’ll fill it in with you.
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="step">
          <h1 className="h-step-sm" style={{ marginBottom: 4 }}>Contact details</h1>
          {isRef && (
            <div className="panel panel--surface">
              <p className="panel__title">About you (referrer)</p>
              <div className="grid-fields">
                <label className="field">
                  <span className="field__label">Your name</span>
                  <input className="input" autoComplete="name" {...field('refName')} />
                </label>
                <label className="field">
                  <span className="field__label">Organisation</span>
                  <input className="input" autoComplete="organization" placeholder="e.g. Lambeth Council" {...field('refOrg')} />
                </label>
                <label className="field">
                  <span className="field__label">Work email</span>
                  <input className="input" type="email" autoComplete="email" {...field('refEmail')} />
                </label>
              </div>
            </div>
          )}
          <div className="panel">
            <p className="panel__title">{isRef ? 'About the person you’re referring' : 'About you'}</p>
            <div className="grid-fields">
              <label className="field">
                <span className="field__label">Full name</span>
                <input className="input" autoComplete={isRef ? 'off' : 'name'} {...field('name')} />
              </label>
              <label className="field">
                <span className="field__label">Phone</span>
                <input className="input" type="tel" inputMode="tel" autoComplete={isRef ? 'off' : 'tel'} {...field('phone')} />
              </label>
              <label className="field">
                <span className="field__label">
                  Email<span className="field__opt">Optional</span>
                </span>
                <input className="input" type="email" {...field('email')} />
              </label>
            </div>
            <div className="field" style={{ gap: 10 }} role="group" aria-labelledby="pref-label">
              <span className="field__label" id="pref-label">Best way to get in touch</span>
              <div className="chip-row">
                {CONTACT_PREFS.map((v) => (
                  <button key={v} type="button" className="chip" aria-pressed={(d.pref || 'Phone call') === v} onClick={() => setD('pref', v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step">
          <h1 className="h-step-sm" style={{ marginBottom: 4 }}>Current situation</h1>
          <div className="panel">
            <p className="panel__title" id="sit-label">Housing situation</p>
            <div role="radiogroup" aria-labelledby="sit-label" className="radios">
              {SITUATIONS.map((v) => (
                <button key={v} type="button" role="radio" aria-checked={d.situation === v} className="radio" onClick={() => setD('situation', v)}>
                  <span className="radio__ring"><i /></span>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="panel">
            <p className="panel__title">Support needs</p>
            <label className="field">
              <span className="field__label" style={{ fontWeight: 400, color: 'var(--color-neutral-800)' }}>
                Share only what you’re comfortable with.<span className="field__opt">Optional</span>
              </span>
              <textarea rows={5} className="input" placeholder="Health, finances, independence goals — anything that helps us understand." {...field('needs')} />
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step step--24">
          <h1 className="h-step-sm">Check and send</h1>
          <div className="review">
            {review.map((r) => (
              <div key={r.label} className="review__row">
                <span>{r.label}</span>
                <span>{r.value}</span>
                <button type="button" className="link-btn" onClick={() => set({ step: r.step })} aria-label={`Edit ${r.label}`}>
                  Edit
                </button>
              </div>
            ))}
          </div>
          <label className="consent">
            <input type="checkbox" checked={!!d.consent} onChange={(e) => setD('consent', e.target.checked)} />
            I consent to Avenir Housing storing this information to assess the application. It’s kept confidential and never shared
            without permission.
          </label>
        </div>
      )}

      {step > 0 && (
        <div className="wiz-nav">
          <button type="button" className="btn btn--ghost" onClick={() => set({ step: Math.max(0, step - 1) })}>
            <Icon d={IC.arrowLeft} size={16} stroke={2.4} round={false} />
            Back
          </button>
          <div className="wiz-nav__right">
            {!can && <span className="wiz-nav__hint">{hint}</span>}
            <button type="button" className="btn btn--primary" aria-disabled={!can || sending} onClick={next}>
              {step === 3 ? (isRef ? 'Send referral' : 'Send application') : 'Continue'} <Arrow />
            </button>
          </div>
        </div>
      )}

    </>
  );
}
