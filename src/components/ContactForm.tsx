'use client';

import { useState } from 'react';
import { Arrow } from './Icon';
import { CONTACT_TOPICS } from '@/lib/content';
import { submitContact } from '@/lib/forms';

export function ContactForm() {
  const [topic, setTopic] = useState(CONTACT_TOPICS[0]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="sent-panel" role="status">
        <span className="sent__sq" />
        <h2>Message sent.</h2>
        <p>We’ll be in touch shortly.</p>
        <div>
          <button type="button" className="btn btn--outline btn--sm" style={{ padding: '0 14px' }} onClick={() => setSent(false)}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="panel contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        await submitContact({ topic, ...data });
        setSent(true);
      }}
    >
      <div className="field-gap" role="group" aria-labelledby="topic-label">
        <span className="field__label" id="topic-label">It’s about</span>
        <div className="chip-row">
          {CONTACT_TOPICS.map((v) => (
            <button key={v} type="button" className="chip" aria-pressed={topic === v} onClick={() => setTopic(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-fields" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))' }}>
        <label className="field">
          <span className="field__label">Name</span>
          <input className="input" name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span className="field__label">Email</span>
          <input className="input" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span className="field__label">
            Phone<span className="field__opt">Optional</span>
          </span>
          <input className="input" name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="field">
        <span className="field__label">Message</span>
        <textarea className="input" name="message" required rows={6} />
      </label>
      <div className="form-foot">
        <button type="submit" className="btn btn--primary" style={{ gap: 12 }}>
          Send message <Arrow />
        </button>
        <span>Kept confidential.</span>
      </div>
    </form>
  );
}
