'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './AdminShell';
import { ConfirmDialog } from './ConfirmDialog';
import { Icon } from '../Icon';
import { IC } from '@/lib/icons';
import { deleteHouse, importSamples, listHouses, refreshSite } from '@/lib/admin/api';
import { propertyHref, type Property } from '@/lib/properties';

const fmt = (t?: number) => (t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export function HouseList() {
  const { user, toast } = useAdmin();
  const [houses, setHouses] = useState<Property[] | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState<Property | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setHouses(await listHouses());
      setErr('');
    } catch {
      setErr('Couldn’t load houses. Check your connection, then reload.');
    }
  }, []);
  useEffect(() => void load(), [load]);

  const doDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deleteHouse(toDelete);
      await refreshSite(user);
      toast(`Deleted ${toDelete.title}`);
      setToDelete(null);
      await load();
    } catch {
      toast('Delete failed — please try again');
    } finally {
      setBusy(false);
    }
  };

  const doImport = async () => {
    setBusy(true);
    try {
      await importSamples();
      await refreshSite(user);
      toast('Imported 6 sample homes');
      await load();
    } catch {
      toast('Import failed — please try again');
    } finally {
      setBusy(false);
    }
  };

  const term = q.toLowerCase().trim();
  const shown = (houses ?? []).filter((h) => !term || `${h.title} ${h.area} ${h.pc} ${h.id}`.toLowerCase().includes(term));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-h1">Houses</h1>
          <p className="adm-muted">{houses ? `${houses.length} listed on the website` : 'Loading…'}</p>
        </div>
        <Link href="/admin/houses/new" className="btn btn--primary btn--md">
          + Add a house
        </Link>
      </div>

      {err && <p className="adm-error" role="alert">{err}</p>}

      {houses && houses.length === 0 && (
        <div className="adm-card adm-empty">
          <h2 className="adm-h2">No houses yet</h2>
          <p className="adm-muted">Add your first house, or start from the six sample homes from the design and edit them.</p>
          <div className="btn-row">
            <Link href="/admin/houses/new" className="btn btn--primary btn--md">Add a house</Link>
            <button type="button" className="btn btn--outline btn--md" onClick={doImport} aria-disabled={busy}>
              {busy ? 'Importing…' : 'Import sample homes'}
            </button>
          </div>
        </div>
      )}

      {houses && houses.length > 0 && (
        <>
          <label className="searchbox adm-search">
            <Icon d={IC.search} size={18} stroke={2.2} color="var(--color-neutral-700)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by address, area or ref" aria-label="Search houses" />
          </label>
          <ul className="adm-list">
            {shown.map((h) => (
              <li key={h.id} className="adm-row">
                <Link href={`/admin/houses/${h.id}`} className="adm-row__main">
                  <span className="adm-thumb">
                    {h.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.images[0].url} alt="" />
                    ) : (
                      <Icon d={IC.home} size={20} color="var(--color-neutral-600)" />
                    )}
                  </span>
                  <span className="adm-row__txt">
                    <b>{h.title}</b>
                    <span className="adm-muted">
                      {h.area} {h.pc} · {h.beds} bed · {h.id}
                    </span>
                  </span>
                </Link>
                <span className={`tag tag--${h.status.split(' ')[0]}`}>{h.status === 'Available' ? h.avail || 'Available' : h.status}</span>
                <span className="adm-muted adm-hide-sm adm-row__date">Updated {fmt(h.updatedAt)}</span>
                <span className="adm-row__actions">
                  <Link href={`/admin/houses/${h.id}`} className="adm-link">Edit</Link>
                  <Link href={propertyHref(h)} className="adm-link" target="_blank">View</Link>
                  <button type="button" className="adm-link adm-link--danger" onClick={() => setToDelete(h)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
            {shown.length === 0 && <li className="adm-muted" style={{ padding: 20 }}>No houses match “{q}”.</li>}
          </ul>
        </>
      )}

      {toDelete && (
        <ConfirmDialog
          title={`Delete ${toDelete.title}?`}
          body="This removes the listing and its photos from the website. It can’t be undone."
          confirm="Delete house"
          busy={busy}
          onConfirm={doDelete}
          onCancel={() => !busy && setToDelete(null)}
        />
      )}
    </>
  );
}
