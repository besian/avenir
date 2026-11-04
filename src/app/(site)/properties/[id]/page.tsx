import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { LeafletMap } from '@/components/LeafletMap';
import { SaveShare } from '@/components/SaveShare';
import { IC } from '@/lib/icons';
import { CONTACT, HREF } from '@/lib/content';
import { description, keyFacts, labels, photoCount, propertyHref } from '@/lib/properties';
import { getProperties } from '@/lib/firebase/server';

type Params = { params: Promise<{ id: string }> };

// Homes added in /admin after a build are rendered on first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProperties()).map((p) => ({ id: p.id.toLowerCase() }));
}

async function find(id: string) {
  const all = await getProperties();
  const i = all.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());
  return { all, i, p: all[i] };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { p } = await find((await params).id);
  if (!p) return {};
  return { title: `${p.title}, ${p.area}`, description: p.summary };
}

export default async function PropertyPage({ params }: Params) {
  const { all, i, p } = await find((await params).id);
  if (!p) notFound();
  const l = labels(p);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const rooms = ['living room', 'bedroom', 'kitchen', 'bathroom'];
  const imgs = p.images ?? [];
  const total = photoCount(p);

  return (
    <>
      <section className="wrap pd-top">
        <div className="pd-crumbs">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/properties">Find a home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{p.area}</span>
          </nav>
          <div style={{ display: 'flex', gap: 6 }}>
            <Link href={propertyHref(prev)} aria-label="Previous home" className="icon-btn">
              <Icon d={IC.chevronLeft} size={18} stroke={2.4} round={false} />
            </Link>
            <Link href={propertyHref(next)} aria-label="Next home" className="icon-btn">
              <Icon d={IC.chevronRight} size={18} stroke={2.4} round={false} />
            </Link>
          </div>
        </div>

        <div className="pd-head">
          <div className="stack-12">
            <div className="pd-head__tags">
              <span className={`tag tag--${p.status.split(' ')[0]}`}>{p.avail}</span>
              <span className="eyebrow">{p.type}</span>
            </div>
            <h1 className="pd-title">{p.title}</h1>
            <p className="pd-addr">{l.addressLine}</p>
          </div>
          <SaveShare id={p.id} title={p.title} />
        </div>

        {/* Uploaded photos (from /admin) fill the grid; striped placeholders stand in for any missing. */}
        <div className="gallery">
          <Photo className="gallery__main" src={imgs[0]?.url} alt={`${p.title}, ${p.area}`} label={`photo — ${p.title.toLowerCase()}, front`} />
          {rooms.map((r, k) => (
            <Photo key={r} src={imgs[k + 1]?.url} alt="" label={r}>
              {k === 3 && total > 5 && <span className="gallery__more">+{total - 5} photos</span>}
            </Photo>
          ))}
        </div>
      </section>

      <section className="wrap pd-body">
        <div className="pd-main">
          <div className="ruled pd-stats">
            <div className="pd-stat"><b>{p.beds}</b><span>{l.bedsLabel}</span></div>
            <div className="pd-stat"><b>{p.baths}</b><span>{l.bathsLabel}</span></div>
            <div className="pd-stat"><b>{p.rec}</b><span>{l.recLabel}</span></div>
            <div className="pd-stat"><b>{p.support}</b><span>support</span></div>
          </div>

          <div className="pd-desc">
            <h2 className="pd-h2">About this home</h2>
            {description(p).map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>

          <div>
            <h2 className="pd-h2">What’s included</h2>
            <div className="features">
              {p.features.map((f) => (
                <div key={f} className="feature">
                  <Icon d={IC.check} size={16} stroke={3} color="var(--color-accent)" round={false} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="pd-h2">Key facts</h2>
            <div className="facts">
              {keyFacts(p).map((k) => (
                <div key={k.label} className="fact">
                  <span>{k.label}</span>
                  <span>{k.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="around">
            <div className="stack-12">
              <h2 className="pd-h2">Getting around</h2>
              <div>
                {p.transport.map(([place, time]) => (
                  <div key={place} className="around__row">
                    <span>{place}</span>
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="around__map">
              {p.lat != null && p.lng != null ? (
                <LeafletMap ariaLabel={`Map showing ${p.title}`} zoom={15} pins={[{ id: p.id, lat: p.lat, lng: p.lng, label: '', title: p.title, status: p.status }]} />
              ) : (
                <Photo className="lmap" label={`map — ${p.area} ${p.pc}`} />
              )}
            </div>
          </div>
        </div>

        <aside className="booking" aria-label="Enquire about this home">
          <p className="eyebrow eyebrow--muted">Availability</p>
          <p className="booking__avail">{p.avail}</p>
          <p className="booking__note">
            Rent is often covered by Housing Benefit. We assess each application to make sure we can meet the person’s needs.
          </p>
          <div className="booking__btns">
            <Link href={HREF.refer} className="btn btn--primary btn--block">
              Refer someone <Arrow />
            </Link>
            <Link href={HREF.applySelf} className="btn btn--outline btn--block">
              Apply for myself <Arrow />
            </Link>
          </div>
          <div className="booking__call">
            <span>Questions about this home?</span>
            <a href={CONTACT.tel}>{CONTACT.phone}</a>
            <small>Quote ref. {p.id}</small>
          </div>
        </aside>
      </section>
    </>
  );
}
