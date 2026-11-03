import Link from 'next/link';
import { Arrow, Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { FaqSection } from '@/components/FaqSection';
import { APPROACH, HREF, PATHS, TEAM, WHO_WE_HELP } from '@/lib/content';
import { availabilitySummary, featuredHomes, labels, propertyHref } from '@/lib/properties';

export default function Home() {
  const avail = availabilitySummary();
  return (
    <>
      <section className="rule-bottom">
        <div className="wrap hero">
          <div className="hero__copy">
            <h1 className="hero__h1">Supporting people. Building futures.</h1>
            <p className="hero__lead">A stable home, and the tools and guidance people need to rebuild their lives.</p>
            <div className="hero__ctas">
              <Link href="/properties" className="btn btn--primary">
                Find a home <Arrow />
              </Link>
              <Link href={HREF.refer} className="btn btn--outline">
                Make a referral
              </Link>
            </div>
          </div>
          <div className="hero__media">
            {/* Hero photo: drop a file at /public/images/hero.jpg and pass src="/images/hero.jpg" */}
            <Photo label="Hero photo — resident at home" />
          </div>
        </div>
      </section>

      <section className="availbar">
        <div className="wrap availbar__in">
          <span className="availbar__count">
            <span className="availbar__sq" />
            {avail.label}
          </span>
          <span className="availbar__areas">{avail.areas}</span>
          <Link href="/properties" className="text-cta">
            See homes <Arrow />
          </Link>
        </div>
      </section>

      <section className="wrap section-pad">
        <div className="section-head">
          <h2 className="h-section">How can we help?</h2>
          <p style={{ fontSize: 15, color: 'var(--color-neutral-700)' }}>Choose what fits — each path takes a few minutes.</p>
        </div>
        <div className="ruled cols-4">
          {PATHS.map((p) => (
            <Link key={p.title} href={p.href} className="path">
              <span className="icon-tile">
                <Icon d={p.icon} size={24} />
              </span>
              <span className="path__kicker">{p.kicker}</span>
              <span className="path__title">{p.title}</span>
              <span className="path__body">{p.body}</span>
              <span className="path__cta">
                {p.cta} <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rule-top">
        <div className="wrap section-pad">
          <div className="section-head">
            <div className="stack-12">
              <p className="eyebrow">Available now</p>
              <h2 className="h-section">Homes ready to move into</h2>
            </div>
            <Link href="/properties" className="btn btn--outline btn--sm">
              All properties
            </Link>
          </div>
          <div className="cards">
            {featuredHomes().map((p) => {
              const l = labels(p);
              return (
                <Link key={p.id} href={propertyHref(p)} className="fcard">
                  <span className="fcard__img">
                    <span className={`tag tag--${p.status.split(' ')[0]}`}>{p.avail}</span>
                    <span className="fcard__ph">photo</span>
                  </span>
                  <span className="fcard__body">
                    <span className="fcard__title">{p.title}</span>
                    <span className="fcard__addr">{l.addressLine}</span>
                    <span className="fcard__spec">{l.specLine}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface rule-top">
        <div className="wrap section-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Our approach</p>
          <h2 className="h-section" style={{ marginBottom: 36, maxWidth: '18ch' }}>
            Homes that feel like yours, support that fits you.
          </h2>
          <div className="ruled cols-2">
            {APPROACH.map((a) => (
              <div key={a.n} className="approach__cell">
                <span className="approach__n">{a.n}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="wrap mission__in">
          <p className="eyebrow">Our mission</p>
          <p className="mission__quote">
            We don’t just offer homes — <span>we support people in building futures.</span>
          </p>
          <div className="mission__grid">
            <div className="stack-12">
              <p className="mission__label">Who we help</p>
              {WHO_WE_HELP.map((w) => (
                <div key={w} className="mission__who">
                  <i />
                  {w}
                </div>
              ))}
            </div>
            <div>
              <p className="mission__stat">10+</p>
              <p className="mission__label">Years of experience</p>
            </div>
            <div>
              <p className="mission__stat">100%</p>
              <p className="mission__label">Happy customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section-pad">
        <div className="team-intro">
          <div className="stack-12">
            <p className="eyebrow">The team</p>
            <h2 className="h-section">People you can talk to</h2>
          </div>
          <p>
            Experienced housing and care professionals focused on safeguarding, attention to detail and consistently high
            standards — so every tenant feels safe, respected and listened to.
          </p>
        </div>
        <div className="team">
          {TEAM.map((t) => (
            <div key={t.name} className="team__member">
              <Photo className="team__photo" label="headshot" />
              <div className="team__meta">
                <p className="team__name">{t.name}</p>
                <p className="team__role">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FaqSection />
    </>
  );
}
