'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAdmin } from './AdminShell';
import { ConfirmDialog } from './ConfirmDialog';
import { Icon } from '../Icon';
import { IC } from '@/lib/icons';
import { deleteHouse, deleteImage, getHouse, listHouses, nextId, refreshSite, saveHouse, uploadImage } from '@/lib/admin/api';
import {
  DEFAULT_AREAS,
  DEFAULT_TYPES,
  SHARED_FEATURES,
  STATUSES,
  SUPPORT_LEVELS,
  areasOf,
  propertyHref,
  type Property,
  type PropertyImage,
} from '@/lib/properties';

const blank = (id: string, ord: number): Property => ({
  id, title: '', area: '', pc: '', type: 'Shared supported house',
  beds: 1, bedsUnit: 'Bedrooms', baths: 1, bathsUnit: 'Bathrooms', rec: 1,
  support: 'Medium', status: 'Available', ord, avail: 'Available now',
  staff: 'Daily support visits', suitable: 'Single adults, 18+', la: '',
  photos: 0, images: [], mx: 50, my: 50, summary: '',
  features: [...SHARED_FEATURES], transport: [['', '']],
});

export function HouseEditor({ id }: { id: string }) {
  const isNew = id === 'new';
  const router = useRouter();
  const { user, toast } = useAdmin();
  const [h, setH] = useState<Property | null>(null);
  const [areas, setAreas] = useState<string[]>(DEFAULT_AREAS);
  const [missing, setMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmDel, setConfirmDel] = useState(false);
  const [dirty, setDirty] = useState(false);
  // Photos uploaded this session (deleted if the edit is abandoned) and removed ones (deleted on save).
  const added = useRef<string[]>([]);
  const removed = useRef<string[]>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      const all = await listHouses().catch(() => [] as Property[]);
      if (!live) return;
      setAreas([...new Set([...DEFAULT_AREAS, ...areasOf(all).filter(Boolean)])].sort());
      if (isNew) {
        setH(blank(nextId(all), all.length ? Math.max(...all.map((p) => p.ord)) + 1 : 0));
      } else {
        const found = all.find((p) => p.id === id) ?? (await getHouse(id).catch(() => null));
        if (!live) return;
        if (found) setH({ ...found, transport: found.transport.length ? found.transport : [['', '']] });
        else setMissing(true);
      }
    })();
    return () => {
      live = false;
    };
  }, [id, isNew]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (missing)
    return (
      <div className="adm-card adm-empty">
        <h1 className="adm-h2">House not found</h1>
        <p className="adm-muted">It may have been deleted.</p>
        <Link href="/admin" className="btn btn--outline btn--md">Back to houses</Link>
      </div>
    );
  if (!h) return <p className="adm-muted adm-center">Loading…</p>;

  const set = (patch: Partial<Property>) => {
    setH((x) => (x ? { ...x, ...patch } : x));
    setDirty(true);
  };
  const num = (k: 'beds' | 'baths' | 'rec' | 'ord') => ({
    value: String(h[k]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set({ [k]: Math.max(0, Math.floor(Number(e.target.value) || 0)) }),
  });
  const txt = (k: 'title' | 'area' | 'pc' | 'type' | 'avail' | 'staff' | 'suitable' | 'la' | 'summary') => ({
    value: h[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [k]: e.target.value }),
  });

  const images = h.images ?? [];
  const setImages = (next: PropertyImage[]) => set({ images: next });
  const move = (i: number, d: number) => {
    const next = images.slice();
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setImages(next);
  };

  const onFiles = async (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;
    setUploading((n) => n + list.length);
    for (const f of list) {
      try {
        const img = await uploadImage(h.id, f);
        added.current.push(img.path);
        setH((x) => (x ? { ...x, images: [...(x.images ?? []), img] } : x));
        setDirty(true);
      } catch {
        toast(`Couldn’t upload ${f.name}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const validate = () => {
    const e: string[] = [];
    if (!h.title.trim()) e.push('Add the address (title).');
    if (!h.area.trim()) e.push('Add the area.');
    if (!h.avail.trim()) e.push('Add the availability text, e.g. “Available now”.');
    if (!h.summary.trim()) e.push('Add a short description.');
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrors(e);
    if (e.length) return window.scrollTo({ top: 0, behavior: 'smooth' });
    if (uploading) return toast('Wait for photos to finish uploading');
    setSaving(true);
    try {
      const clean: Property = {
        ...h,
        title: h.title.trim(),
        area: h.area.trim(),
        pc: h.pc.trim().toUpperCase(),
        features: h.features.map((f) => f.trim()).filter(Boolean),
        transport: h.transport.map(([a, b]) => [a.trim(), b.trim()] as [string, string]).filter(([a]) => a),
      };
      await saveHouse(clean);
      await Promise.all(removed.current.map(deleteImage));
      added.current = [];
      removed.current = [];
      setDirty(false);
      const refreshed = await refreshSite(user);
      toast(refreshed ? 'Saved — live on the website' : 'Saved — the website updates within 5 minutes');
      router.push('/admin');
    } catch {
      toast('Save failed — check your connection and try again');
    } finally {
      setSaving(false);
    }
  };

  const cancel = async () => {
    if (dirty && !window.confirm('Discard your changes?')) return;
    await Promise.all(added.current.map(deleteImage));
    added.current = [];
    setDirty(false);
    router.push('/admin');
  };

  const doDelete = async () => {
    setSaving(true);
    try {
      await deleteHouse({ ...h, images: [...images, ...removed.current.map((path) => ({ url: '', path }))] });
      setDirty(false);
      await refreshSite(user);
      toast(`Deleted ${h.title || h.id}`);
      router.push('/admin');
    } catch {
      toast('Delete failed — please try again');
      setSaving(false);
    }
  };

  const missingFeatures = SHARED_FEATURES.filter((f) => !h.features.includes(f));

  return (
    <div className="adm-editor">
      <div className="adm-head">
        <div>
          <Link href="/admin" className="adm-link" onClick={(e) => { e.preventDefault(); cancel(); }}>
            ← All houses
          </Link>
          <h1 className="adm-h1">{isNew ? 'Add a house' : h.title || 'Edit house'}</h1>
          <p className="adm-muted">Ref. {h.id}{!isNew && <> · <Link href={propertyHref(h)} target="_blank">View on site ↗</Link></>}</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="adm-error adm-error--box" role="alert">
          <b>Please fix:</b>
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Address & location</h2>
        <div className="grid-fields">
          <label className="field adm-span-2">
            <span className="field__label">Address (shown as the title)</span>
            <input className="input" placeholder="e.g. 24 Leigham Court Road" {...txt('title')} />
          </label>
          <label className="field">
            <span className="field__label">Area</span>
            <input className="input" list="adm-areas" placeholder="e.g. Streatham" {...txt('area')} />
            <datalist id="adm-areas">{areas.map((a) => <option key={a} value={a} />)}</datalist>
          </label>
          <label className="field">
            <span className="field__label">Postcode</span>
            <input className="input input--upper" placeholder="e.g. SW16 1EH" {...txt('pc')} />
          </label>
          <label className="field">
            <span className="field__label">Local authority</span>
            <input className="input" placeholder="e.g. Lambeth" {...txt('la')} />
          </label>
          <label className="field">
            <span className="field__label">Property type</span>
            <input className="input" list="adm-types" {...txt('type')} />
            <datalist id="adm-types">{DEFAULT_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Availability</h2>
        <div className="field" role="group" aria-labelledby="adm-status">
          <span className="field__label" id="adm-status">Status</span>
          <div className="seg" style={{ alignSelf: 'flex-start' }}>
            {STATUSES.map((s) => (
              <button key={s} type="button" className="seg__opt" aria-pressed={h.status === s} onClick={() => set({ status: s, avail: s === 'Full' ? 'Currently full' : s === 'Available' && h.avail === 'Currently full' ? 'Available now' : h.avail })}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-fields">
          <label className="field">
            <span className="field__label">Availability text<span className="field__opt">Shown on the label</span></span>
            <input className="input" placeholder="Available now · From 1 Nov 2026" {...txt('avail')} />
          </label>
          <label className="field">
            <span className="field__label">Listing order<span className="field__opt">Lower shows first</span></span>
            <input className="input" type="number" min={0} inputMode="numeric" {...num('ord')} />
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Rooms</h2>
        <div className="grid-fields">
          <div className="field">
            <span className="field__label">Bedrooms</span>
            <div className="adm-pair">
              <input className="input" type="number" min={0} inputMode="numeric" aria-label="Number of bedrooms" {...num('beds')} />
              <select className="input" aria-label="Bedroom type" value={h.bedsUnit} onChange={(e) => set({ bedsUnit: e.target.value as Property['bedsUnit'] })}>
                <option>Bedrooms</option>
                <option>One-bed flats</option>
              </select>
            </div>
          </div>
          <div className="field">
            <span className="field__label">Bathrooms</span>
            <div className="adm-pair">
              <input className="input" type="number" min={0} inputMode="numeric" aria-label="Number of bathrooms" {...num('baths')} />
              <select className="input" aria-label="Bathroom type" value={h.bathsUnit} onChange={(e) => set({ bathsUnit: e.target.value as Property['bathsUnit'] })}>
                <option>Bathrooms</option>
                <option>Private bathrooms</option>
              </select>
            </div>
          </div>
          <label className="field">
            <span className="field__label">Reception rooms</span>
            <input className="input" type="number" min={0} inputMode="numeric" {...num('rec')} />
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Support</h2>
        <div className="field" role="group" aria-labelledby="adm-support">
          <span className="field__label" id="adm-support">Support level</span>
          <div className="seg" style={{ alignSelf: 'flex-start' }}>
            {SUPPORT_LEVELS.map((s) => (
              <button key={s} type="button" className="seg__opt" aria-pressed={h.support === s} onClick={() => set({ support: s })}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-fields">
          <label className="field">
            <span className="field__label">Staff presence</span>
            <input className="input" placeholder="e.g. Daily support visits" {...txt('staff')} />
          </label>
          <label className="field">
            <span className="field__label">Suitable for</span>
            <input className="input" placeholder="e.g. Single adults, 18+" {...txt('suitable')} />
          </label>
        </div>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Description</h2>
        <label className="field">
          <span className="field__label">About this home<span className="field__opt">1–2 sentences</span></span>
          <textarea className="input" rows={3} placeholder="A bright Victorian house with a large garden, five minutes from the station." {...txt('summary')} />
        </label>
        <p className="adm-muted adm-small">The page adds a standard paragraph about furnishing and support after this.</p>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">What’s included</h2>
        <ul className="adm-chips">
          {h.features.map((f, i) => (
            <li key={`${f}-${i}`} className="adm-chip">
              {f}
              <button type="button" aria-label={`Remove ${f}`} onClick={() => set({ features: h.features.filter((_, j) => j !== i) })}>
                <Icon d={IC.close} size={14} />
              </button>
            </li>
          ))}
        </ul>
        <AddFeature onAdd={(f) => !h.features.includes(f) && set({ features: [...h.features, f] })} />
        {missingFeatures.length > 0 && (
          <div className="chip-row chip-row--tight">
            <span className="adm-muted adm-small" style={{ alignSelf: 'center' }}>Quick add:</span>
            {missingFeatures.map((f) => (
              <button key={f} type="button" className="chip" style={{ height: 34 }} onClick={() => set({ features: [...h.features, f] })}>
                + {f}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Getting around</h2>
        {h.transport.map(([place, time], i) => (
          <div key={i} className="adm-trow">
            <input className="input" aria-label="Place" placeholder="e.g. Streatham station" value={place}
              onChange={(e) => set({ transport: h.transport.map((t, j) => (j === i ? [e.target.value, t[1]] : t)) })} />
            <input className="input" aria-label="Time" placeholder="6 min walk" value={time}
              onChange={(e) => set({ transport: h.transport.map((t, j) => (j === i ? [t[0], e.target.value] : t)) })} />
            <button type="button" className="icon-btn" aria-label="Remove row" onClick={() => set({ transport: h.transport.filter((_, j) => j !== i) })}>
              <Icon d={IC.close} size={16} />
            </button>
          </div>
        ))}
        <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => set({ transport: [...h.transport, ['', '']] })}>
          + Add a place
        </button>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Photos</h2>
        <p className="adm-muted adm-small">The first photo is the cover. Large photos are resized automatically.</p>
        {images.length > 0 && (
          <ul className="adm-photos">
            {images.map((img, i) => (
              <li key={img.path || img.url} className="adm-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Photo ${i + 1}`} />
                {i === 0 && <span className="adm-photo__cover">Cover</span>}
                <div className="adm-photo__tools">
                  <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}><Icon d={IC.chevronLeft} size={16} /></button>
                  <button type="button" aria-label="Move later" disabled={i === images.length - 1} onClick={() => move(i, 1)}><Icon d={IC.chevronRight} size={16} /></button>
                  <button type="button" aria-label="Remove photo" onClick={() => { removed.current.push(img.path); setImages(images.filter((_, j) => j !== i)); }}>
                    <Icon d={IC.close} size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label className="upload" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
          <b>{uploading ? `Uploading ${uploading}…` : 'Add photos'}</b>
          <span>Drop images here or choose files</span>
          <input type="file" accept="image/*" multiple onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
        </label>
      </section>

      <section className="adm-card adm-sec">
        <h2 className="adm-h2">Map pin</h2>
        <p className="adm-muted adm-small">Click to place the pin on the South London map preview.</p>
        <div
          className="adm-map"
          role="application"
          aria-label="Map pin position"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            set({ mx: Math.round(((e.clientX - r.left) / r.width) * 100), my: Math.round(((e.clientY - r.top) / r.height) * 100) });
          }}
        >
          <span className="pin" data-status={h.status} style={{ left: `${h.mx}%`, top: `${h.my}%` }}>•</span>
        </div>
      </section>

      <div className="adm-savebar">
        {!isNew && (
          <button type="button" className="adm-link adm-link--danger" onClick={() => setConfirmDel(true)}>
            Delete house
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="btn btn--outline btn--sm" onClick={cancel}>Cancel</button>
        <button type="button" className="btn btn--primary btn--sm" onClick={save} aria-disabled={saving || uploading > 0}>
          {saving ? 'Saving…' : isNew ? 'Add house' : 'Save changes'}
        </button>
      </div>

      {confirmDel && (
        <ConfirmDialog
          title={`Delete ${h.title || h.id}?`}
          body="This removes the listing and its photos from the website. It can’t be undone."
          confirm="Delete house"
          busy={saving}
          onConfirm={doDelete}
          onCancel={() => !saving && setConfirmDel(false)}
        />
      )}
    </div>
  );
}

function AddFeature({ onAdd }: { onAdd: (f: string) => void }) {
  const [v, setV] = useState('');
  const add = () => {
    if (v.trim()) onAdd(v.trim());
    setV('');
  };
  return (
    <div className="adm-trow" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
      <input className="input" placeholder="Add a feature, e.g. Private garden" value={v} onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
      <button type="button" className="btn btn--outline btn--sm" onClick={add}>Add</button>
    </div>
  );
}
