'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { HeartIcon } from './HeartIcon';
import { IC } from '@/lib/icons';
import { AREAS, PROPERTIES, byOrder, homesCount, labels, propertyHref, type Property } from '@/lib/properties';
import { useSaved } from '@/lib/storage';
import { useModal } from '@/lib/useModal';

type View = 'Grid' | 'Map';
const STATUS = ['All', 'Available', 'Coming soon'] as const;
const BEDS: [number, string][] = [[0, 'Any'], [3, '3+'], [4, '4+'], [5, '5+']];
const tagClass = (p: Property) => `tag tag--${p.status.split(' ')[0]}`;

export function PropertiesBrowser({ defaultView = 'Grid' }: { defaultView?: View }) {
  const [status, setStatus] = useState<(typeof STATUS)[number]>('All');
  const [area, setArea] = useState('All areas');
  const [beds, setBeds] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [view, setView] = useState<View>(defaultView);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const { saved, toggle, isSaved } = useSaved();

  const list = PROPERTIES.filter(
    (p) =>
      (status === 'All' || p.status === status) &&
      (area === 'All areas' || p.area === area) &&
      p.beds >= beds &&
      (!showSaved || saved.includes(p.id)),
  ).sort(byOrder);

  const filterCount = (status !== 'All' ? 1 : 0) + (area !== 'All areas' ? 1 : 0) + (beds > 0 ? 1 : 0);
  const filtersActive = filterCount > 0 || showSaved;
  const clear = () => {
    setStatus('All');
    setArea('All areas');
    setBeds(0);
    setShowSaved(false);
  };

  const heart = (p: Property, overlay: boolean) => (
    <button
      type="button"
      onClick={() => toggle(p.id)}
      aria-pressed={isSaved(p.id)}
      aria-label={`${isSaved(p.id) ? 'Saved' : 'Save'} ${p.title}`}
      className={`heart${overlay ? ' heart--overlay' : ''}`}
    >
      <HeartIcon size={overlay ? 20 : 18} filled={isSaved(p.id)} />
    </button>
  );

  return (
    <>
      <div className="filterbar">
        <div className="wrap filterbar__in">
          <button type="button" className="filters-btn mob-only" onClick={() => setSheet(true)} aria-haspopup="dialog">
            <Icon d={IC.sliders} size={16} />
            Filters
            {filterCount > 0 && <span className="filters-btn__n">{filterCount}</span>}
          </button>
          <div role="group" aria-label="Availability" className="seg desk-only">
            {STATUS.map((v) => (
              <button key={v} type="button" className="seg__opt" aria-pressed={status === v} onClick={() => setStatus(v)}>
                {v}
              </button>
            ))}
          </div>
          <label className="select-wrap desk-only">
            Area
            <select aria-label="Area" value={area} onChange={(e) => setArea(e.target.value)}>
              <option>All areas</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Bedrooms" className="seg desk-only">
            <span className="seg__label">Beds</span>
            {BEDS.map(([v, label]) => (
              <button key={v} type="button" className="seg__opt seg__opt--num" aria-pressed={beds === v} onClick={() => setBeds(v)}>
                {label}
              </button>
            ))}
          </div>
          {filtersActive && (
            <button type="button" className="clear-btn desk-only" onClick={clear}>
              Clear filters
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="saved-btn" aria-pressed={showSaved} onClick={() => setShowSaved(!showSaved)}>
            <HeartIcon size={16} filled={showSaved || saved.length > 0} />
            <span className="hide-sm">Saved · </span>
            {saved.length}
          </button>
          <div role="group" aria-label="View" className="seg">
            {(
              [
                ['Grid', IC.grid],
                ['Map', IC.pin],
              ] as const
            ).map(([v, icon]) => (
              <button key={v} type="button" className="seg__opt" aria-pressed={view === v} aria-label={`${v} view`} onClick={() => setView(v)}>
                <Icon d={icon} size={15} />
                <span className="hide-sm">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {sheet && (
        <FilterSheet
          onClose={closeSheet}
          count={list.length}
          status={status}
          setStatus={setStatus}
          area={area}
          setArea={setArea}
          beds={beds}
          setBeds={setBeds}
          onClear={clear}
          active={filterCount > 0}
        />
      )}

      <section className="wrap results">
        <p aria-live="polite" className="results__count">
          {homesCount(list.length)}
        </p>

        {list.length === 0 && (
          <div className="empty-state">
            <h3>No homes match those filters.</h3>
            <p>New homes come up regularly. Clear the filters, or call us and we’ll tell you what’s coming.</p>
            <button type="button" className="btn btn--outline btn--sm" onClick={clear}>
              Clear filters
            </button>
          </div>
        )}

        {view === 'Grid' && list.length > 0 && (
          <div className="pgrid">
            {list.map((p) => (
              <article key={p.id} className="pcard">
                <Link href={propertyHref(p)} aria-label={`View ${p.title}`} className="pcard__img" tabIndex={-1}>
                  <span className={tagClass(p)}>{p.avail}</span>
                  <span className="fcard__ph">photo · {p.photos}</span>
                </Link>
                {heart(p, true)}
                <Link href={propertyHref(p)} className="pcard__body">
                  <span className="pcard__type">{p.type}</span>
                  <span className="pcard__title">{p.title}</span>
                  <span className="fcard__addr">{labels(p).addressLine}</span>
                  <span className="pcard__specs">
                    <span className="pcard__spec" title={labels(p).bedsLabel}>
                      <Icon d={IC.bed} size={17} />
                      <strong>{p.beds}</strong>
                    </span>
                    <span className="pcard__spec" title={labels(p).bathsLabel}>
                      <Icon d={IC.bath} size={17} />
                      <strong>{p.baths}</strong>
                    </span>
                    <span className="pcard__spec" title={labels(p).recLabel}>
                      <Icon d={IC.sofa} size={17} />
                      <strong>{p.rec}</strong>
                    </span>
                    <span className="pcard__support">{p.support} support</span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}

        {view === 'Map' && list.length > 0 && (
          <div className="mapview">
            <div className="maplist">
              {list.map((p, i) => (
                <div
                  key={p.id}
                  className="maprow"
                  data-hover={hoverId === p.id}
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <span className="maprow__n" data-status={p.status}>
                    {i + 1}
                  </span>
                  <Link href={propertyHref(p)} className="maprow__link" onFocus={() => setHoverId(p.id)} onBlur={() => setHoverId(null)}>
                    <span className="maprow__title">{p.title}</span>
                    <span className="maprow__sub">
                      {p.area} · {labels(p).specLine}
                    </span>
                  </Link>
                  <span className={tagClass(p)}>{p.avail}</span>
                  {heart(p, false)}
                </div>
              ))}
            </div>
            {/* Placeholder map — swap for a real map (e.g. Mapbox/Leaflet) using each property's coordinates. */}
            <div className="mapbox">
              <span className="mapbox__label">map — South London</span>
              {list.map((p, i) => (
                <Link
                  key={p.id}
                  href={propertyHref(p)}
                  aria-label={p.title}
                  className="pin"
                  data-status={p.status}
                  data-hover={hoverId === p.id}
                  style={{ left: `${p.mx}%`, top: `${p.my}%` }}
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

interface SheetProps {
  onClose: () => void;
  count: number;
  status: (typeof STATUS)[number];
  setStatus: (v: (typeof STATUS)[number]) => void;
  area: string;
  setArea: (v: string) => void;
  beds: number;
  setBeds: (v: number) => void;
  onClear: () => void;
  active: boolean;
}

/** Phone-only bottom sheet holding the availability, area and bedroom filters. */
function FilterSheet({ onClose, count, status, setStatus, area, setArea, beds, setBeds, onClear, active }: SheetProps) {
  useModal(onClose);
  return createPortal(
    <div className="sheet-backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="fsheet-title" className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <h2 id="fsheet-title" className="sheet__title">Filters</h2>
          <button type="button" className="m-icon m-icon--end" onClick={onClose} aria-label="Close filters" autoFocus>
            <Icon d={IC.close} size={22} />
          </button>
        </div>
        <div className="sheet__body">
          <div className="sheet__group" role="group" aria-labelledby="fs-avail">
            <p className="sheet__label" id="fs-avail">Availability</p>
            <div className="seg seg--full">
              {STATUS.map((v) => (
                <button key={v} type="button" className="seg__opt" aria-pressed={status === v} onClick={() => setStatus(v)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <label className="sheet__group">
            <span className="sheet__label">Area</span>
            <select className="input" value={area} onChange={(e) => setArea(e.target.value)}>
              <option>All areas</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <div className="sheet__group" role="group" aria-labelledby="fs-beds">
            <p className="sheet__label" id="fs-beds">Bedrooms</p>
            <div className="seg seg--full">
              {BEDS.map(([v, label]) => (
                <button key={v} type="button" className="seg__opt" aria-pressed={beds === v} onClick={() => setBeds(v)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sheet__foot">
          <button type="button" className="clear-btn" onClick={onClear} disabled={!active}>
            Clear all
          </button>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Show {homesCount(count)}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
