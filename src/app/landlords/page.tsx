import type { Metadata } from 'next';
import { Photo } from '@/components/Photo';
import { LandlordForm } from '@/components/LandlordForm';
import { PARTNERS, PARTNER_STEPS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Landlords & partners',
  description: 'We partner with landlords and local organisations to create secure, sustainable homes and stronger communities.',
};

export default function LandlordsPage() {
  return (
    <>
      <section className="wrap ll-hero">
        <div className="page-intro" style={{ paddingTop: 0, gap: 20 }}>
          <p className="eyebrow">Landlords &amp; partners</p>
          <h1 className="h-display">Homes that change lives.</h1>
          <p className="lead" style={{ maxWidth: '46ch' }}>
            We partner with landlords and local organisations to create secure, sustainable homes and stronger communities.
          </p>
        </div>
        <Photo className="ll-hero__img" label="photo — furnished room" />
      </section>

      <section className="rule-top bg-surface">
        <div className="wrap" style={{ paddingTop: 'clamp(56px,7vw,96px)', paddingBottom: 'clamp(56px,7vw,96px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 28 }}>Who we work with</h2>
          <div className="ruled cols-4">
            {PARTNERS.map((p) => (
              <div key={p.title} className="partner">
                <i />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap two-col" style={{ paddingTop: 'clamp(56px,7vw,96px)', paddingBottom: 'clamp(56px,7vw,96px)' }}>
        <div>
          <h2 className="h-sub" style={{ marginBottom: 24 }}>How a partnership works</h2>
          <div className="steps">
            {PARTNER_STEPS.map((s) => (
              <div key={s.n} className="pstep">
                <span className="pstep__n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-box">
          <LandlordForm />
        </div>
      </section>
    </>
  );
}
