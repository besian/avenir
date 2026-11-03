import type { ReactNode } from 'react';

export function Progress({ steps, current, aside }: { steps: string[]; current: number; aside?: ReactNode }) {
  return (
    <div className="progress-head">
      <div className="progress-head__row">
        <p className="eyebrow" aria-live="polite">{`Step ${current + 1} of ${steps.length} · ${steps[current]}`}</p>
        {aside}
      </div>
      <div className="progress" aria-hidden="true">
        {steps.map((t, i) => (
          <div key={t} className="progress__step" data-done={i <= current} data-current={i === current}>
            <span className="progress__bar" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
