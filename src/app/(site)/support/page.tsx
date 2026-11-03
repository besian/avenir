import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { IC } from '@/lib/icons';
import { COMPLAINT_STEPS, CONTACT, SUPPORT_AREAS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Person-centred support tailored to each resident — budgeting, health, life skills and moving on. How to report a repair or make a complaint.',
};

const Arrow20 = ({ d = IC.arrowRight }: { d?: string }) => <Icon d={d} size={20} stroke={2.4} round={false} />;

export default function SupportPage() {
  return (
    <>
      <section className="wrap page-intro" style={{ paddingBottom: 'clamp(40px,5vw,56px)' }}>
        <p className="eyebrow">Support</p>
        <h1 className="h-display">Support, tailored to you.</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          Person-centred care that recognises each person’s circumstances. Staff presence depends on the property and each
          resident’s needs.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 'clamp(56px,7vw,96px)' }}>
        <div className="ruled cols-5">
          {SUPPORT_AREAS.map((a) => (
            <div key={a.title} className="sarea">
              <Icon d={a.icon} size={26} color="var(--color-accent)" />
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tenant-band">
        <div className="wrap tenant-band__in">
          <h2 className="h-sub">Already a tenant?</h2>
          <div className="tenant-btns">
            <Link href="/repair" className="tenant-btn tenant-btn--solid">
              Report a repair <Arrow20 />
            </Link>
            <a href="#complaints" className="tenant-btn">
              Make a complaint <Arrow20 d={IC.arrowDown} />
            </a>
            <a href={CONTACT.tel} className="tenant-btn">
              Call the team <Arrow20 />
            </a>
          </div>
        </div>
      </section>

      <section id="complaints" className="wrap complaints">
        <p className="eyebrow">Complaints</p>
        <div className="complaints__intro">
          <h2 className="h-sub">Unhappy with something? Tell us.</h2>
          <p>
            Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your contact details, what happened, and any
            relevant dates or documents. We handle every complaint fairly and discreetly.
          </p>
        </div>
        <div className="ruled cols-3">
          {COMPLAINT_STEPS.map((c) => (
            <div key={c.title} className="cstep">
              <span className="cstep__t">{c.time}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
        <p className="escalate">
          Escalations go to our Director at <a href={`mailto:${CONTACT.directorEmail}`}>{CONTACT.directorEmail}</a>.
        </p>
      </section>
    </>
  );
}
