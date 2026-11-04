'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as MLMap, Marker as MLMarker, StyleSpecification, LayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  title?: string;
  status?: string;
}

interface Props {
  pins: MapPin[];
  /** Highlighted pin (e.g. the list row being hovered). */
  activeId?: string | null;
  onPinHover?: (id: string | null) => void;
  onPinClick?: (id: string) => void;
  /** Picker mode: clicking the map (or dragging the pin) reports a new position. */
  onPick?: (lat: number, lng: number) => void;
  zoom?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Vector basemap: OpenFreeMap "Positron" — free, no API key, no usage limits,
 * commercial use allowed (https://openfreemap.org). Recoloured below to the
 * site palette. To change provider, point STYLE_URL at another MapLibre style.
 */
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
/** South London, used when there are no pins to frame. [lng, lat] */
const DEFAULT_CENTER: [number, number] = [-0.13, 51.425];

const PALETTE = {
  land: '#f5f4ef', // --color-bg
  water: '#d8e2e0',
  green: '#e2eadc', // soft sage for parks/woods
  building: '#ebeae2',
  label: '#5b5f57', // --color-neutral-700
  labelHalo: '#f5f4ef',
};

/** Recolour the base style's land, water, greenery, buildings and labels. */
function tint(style: StyleSpecification): StyleSpecification {
  const layers = style.layers.map((l): LayerSpecification => {
    const id = l.id.toLowerCase();
    const paint = { ...(('paint' in l && l.paint) || {}) } as Record<string, unknown>;
    if (l.type === 'background') paint['background-color'] = PALETTE.land;
    else if (l.type === 'fill' && /water|ocean|lake|river/.test(id)) paint['fill-color'] = PALETTE.water;
    else if (l.type === 'line' && /waterway|river|canal/.test(id)) paint['line-color'] = PALETTE.water;
    else if (l.type === 'fill' && /park|wood|forest|grass|landcover|nature|cemetery|pitch/.test(id)) paint['fill-color'] = PALETTE.green;
    else if (l.type === 'fill' && /building/.test(id)) paint['fill-color'] = PALETTE.building;
    else if (l.type === 'symbol') {
      paint['text-color'] = PALETTE.label;
      paint['text-halo-color'] = PALETTE.labelHalo;
    }
    return { ...l, paint } as LayerSpecification;
  });
  return { ...style, layers };
}

/** Plain style used if the basemap can't be loaded, so pins still work. */
const FALLBACK: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#eaeae2' } }],
};

let stylePromise: Promise<StyleSpecification> | null = null;
const loadStyle = () =>
  (stylePromise ??= fetch(STYLE_URL)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`style ${r.status}`))))
    .then((s: StyleSpecification) => tint(s))
    .catch((e) => {
      console.warn('[map] basemap unavailable, using plain background', e);
      stylePromise = null; // retry on the next map
      return FALLBACK;
    }));

/** Interactive map with the site's square numbered pins. MapLibre needs WebGL, so it loads in the browser only. */
export function SiteMap({ pins, activeId, onPinHover, onPinClick, onPick, zoom = 13, className = '', ariaLabel = 'Map' }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const lib = useRef<typeof import('maplibre-gl') | null>(null);
  const markers = useRef<Map<string, { mk: MLMarker; inner: HTMLSpanElement }>>(new Map());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const cb = useRef({ onPinHover, onPinClick, onPick });
  cb.current = { onPinHover, onPinClick, onPick };

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ml, style] = await Promise.all([import('maplibre-gl'), loadStyle()]);
        if (cancelled || !el.current) return;
        ml.setWorkerUrl(`/vendor/maplibre-gl-worker-${process.env.NEXT_PUBLIC_MAPLIBRE_VERSION}.mjs`);
        lib.current = ml;
        const m = new ml.Map({
          container: el.current,
          style,
          center: DEFAULT_CENTER,
          zoom: 10.5,
          attributionControl: { compact: true },
          scrollZoom: false,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
        });
        m.touchZoomRotate.disableRotation();
        m.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
        // Wheel-zoom only after the visitor clicks into the map, so page scrolling isn't hijacked.
        m.on('click', (e) => {
          m.scrollZoom.enable();
          cb.current.onPick?.(+e.lngLat.lat.toFixed(6), +e.lngLat.lng.toFixed(6));
        });
        m.getContainer().addEventListener('mouseleave', () => m.scrollZoom.disable());
        // Keep the canvas matched to its box (sticky panels, layout changes).
        const ro = new ResizeObserver(() => m.resize());
        ro.observe(el.current);
        m.once('remove', () => ro.disconnect());
        map.current = m;
        setReady(true);
      } catch (e) {
        console.warn('[map] could not start (WebGL unavailable?)', e);
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current.clear();
    };
  }, []);

  // Sync markers; reframe when the set of pins changes.
  const lastKey = useRef('');
  useEffect(() => {
    const m = map.current, ml = lib.current;
    if (!ready || !m || !ml) return;
    const seen = new Set<string>();
    for (const p of pins) {
      seen.add(p.id);
      let entry = markers.current.get(p.id);
      if (!entry) {
        const outer = document.createElement('div');
        const inner = document.createElement('span');
        inner.className = 'pin pin--map';
        outer.appendChild(inner);
        outer.addEventListener('mouseenter', () => cb.current.onPinHover?.(p.id));
        outer.addEventListener('mouseleave', () => cb.current.onPinHover?.(null));
        outer.addEventListener('click', (e) => {
          e.stopPropagation();
          cb.current.onPinClick?.(p.id);
        });
        const mk = new ml.Marker({ element: outer, anchor: 'center', draggable: !!cb.current.onPick }).setLngLat([p.lng, p.lat]).addTo(m);
        mk.on('dragend', () => {
          const ll = mk.getLngLat();
          cb.current.onPick?.(+ll.lat.toFixed(6), +ll.lng.toFixed(6));
        });
        entry = { mk, inner };
        markers.current.set(p.id, entry);
      }
      entry.mk.setLngLat([p.lng, p.lat]);
      entry.inner.textContent = p.label ?? '';
      entry.inner.dataset.status = p.status ?? '';
      entry.inner.dataset.hover = String(p.id === activeId);
      entry.inner.title = p.title ?? '';
      entry.mk.getElement().style.zIndex = p.id === activeId ? '2' : '1';
    }
    for (const [id, { mk }] of markers.current) if (!seen.has(id)) { mk.remove(); markers.current.delete(id); }

    const key = pins.map((p) => p.id).join(',');
    if (key !== lastKey.current) {
      lastKey.current = key;
      if (pins.length === 1) m.jumpTo({ center: [pins[0].lng, pins[0].lat], zoom: Math.max(m.getZoom(), zoom) });
      else if (pins.length > 1) {
        const b = new ml.LngLatBounds();
        pins.forEach((p) => b.extend([p.lng, p.lat]));
        m.fitBounds(b, { padding: 48, maxZoom: zoom, animate: false });
      }
    }
  }, [pins, activeId, ready, zoom]);

  return (
    <div className={`smap ${className}`} role="region" aria-label={ariaLabel}>
      <div ref={el} className="smap__canvas" />
      {failed && <span className="smap__fail">Map unavailable</span>}
    </div>
  );
}
