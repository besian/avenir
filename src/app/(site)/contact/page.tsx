import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { ContactForm } from '@/components/ContactForm';
import { CHANNELS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Referrals, partnerships or just a question — call, email or visit Avenir Housing. We respond promptly and confidentially.',
};

export default function ContactPage() {
  return (
    <>
      <section className="wrap page-intro" style={{ paddingBottom: 36 }}>
        <p className="eyebrow">Contact</p>
        <h1 className="h-display">Let’s talk.</h1>
        <p className="lead" style={{ maxWidth: '56ch' }}>
          Referrals, partnerships or just a question — we respond promptly and confidentially.
        </p>
      </section>

      <section className="wrap">
        <div className="ruled cols-3">
          {CHANNELS.map((c) => (
            <a key={c.label} href={c.href} className="channel" {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}>
              <Icon d={c.icon} size={24} color="var(--color-accent)" />
              <span className="channel__label">{c.label}</span>
              <span className="channel__value">{c.value}</span>
              <span className="channel__hint">{c.hint}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="wrap contact-form-sec">
        <div className="stack-12 contact-form-sec__intro">
          <h2 className="h-sub" style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}>Send a message</h2>
          <p>We reply within a working day. For anything urgent, please call.</p>
        </div>
        <div className="contact-form-wrap">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
