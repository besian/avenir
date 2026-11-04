'use client';

import { useEffect, useRef } from 'react';
import type { LatLngTuple, Map as LMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

/** South London, used when there are no pins to frame. */
const DEFAULT_CENTER: LatLngTuple = [51.425, -0.13];

// OpenStreetMap's standard tiles: free with attribution, fine for modest traffic.
// For heavy traffic, swap TILE_URL for a provider plan (e.g. MapTiler, Stadia).
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * Interactive Leaflet map with the site's square numbered pins.
 * Leaflet touches `window`, so it is loaded only in the browser.
 */
export function LeafletMap({ pins, activeId, onPinHover, onPinClick, onPick, zoom = 13, className = '', ariaLabel = 'Map' }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const L = useRef<typeof import('leaflet') | null>(null);
  // Keep the latest callbacks without re-creating the map.
  const cb = useRef({ onPinHover, onPinClick, onPick });
  cb.current = { onPinHover, onPinClick, onPick };

  const icon = (p: MapPin, active: boolean) =>
    L.current!.divIcon({
      className: '',
      html: `<span class="pin pin--map" data-status="${p.status ?? ''}" data-hover="${active}">${p.label ?? ''}</span>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leaflet = (await import('leaflet')).default;
      if (cancelled || !el.current || map.current) return;
      L.current = leaflet;
      const m = leaflet.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView(DEFAULT_CENTER, 11);
      leaflet.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
      m.on('click', (e) => cb.current.onPick?.(+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)));
      // Allow wheel-zoom only after the map is clicked, so page scrolling isn't hijacked.
      m.on('focus', () => m.scrollWheelZoom.enable());
      m.on('blur', () => m.scrollWheelZoom.disable());
      map.current = m;
      sync(true);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add / move / remove markers when pins change; reframe when the set changes.
  const lastKey = useRef('');
  const sync = (force = false) => {
    const m = map.current, leaflet = L.current;
    if (!m || !leaflet) return;
    const seen = new Set<string>();
    for (const p of pins) {
      seen.add(p.id);
      const existing = markers.current.get(p.id);
      if (existing) {
        existing.setLatLng([p.lat, p.lng]);
        existing.setIcon(icon(p, p.id === activeId));
        continue;
      }
      const mk = leaflet.marker([p.lat, p.lng], { icon: icon(p, p.id === activeId), title: p.title, draggable: !!cb.current.onPick, keyboard: true });
      mk.on('mouseover', () => cb.current.onPinHover?.(p.id));
      mk.on('mouseout', () => cb.current.onPinHover?.(null));
      mk.on('click', () => cb.current.onPinClick?.(p.id));
      mk.on('dragend', () => {
        const ll = mk.getLatLng();
        cb.current.onPick?.(+ll.lat.toFixed(6), +ll.lng.toFixed(6));
      });
      mk.addTo(m);
      markers.current.set(p.id, mk);
    }
    for (const [id, mk] of markers.current) if (!seen.has(id)) { mk.remove(); markers.current.delete(id); }

    const key = pins.map((p) => p.id).join(',');
    if (force || key !== lastKey.current) {
      lastKey.current = key;
      if (pins.length === 1) m.setView([pins[0].lat, pins[0].lng], Math.max(m.getZoom(), zoom));
      else if (pins.length > 1) m.fitBounds(pins.map((p) => [p.lat, p.lng] as LatLngTuple), { padding: [40, 40], maxZoom: zoom });
    }
  };

  useEffect(() => {
    sync();
    markers.current.forEach((mk, id) => mk.setZIndexOffset(id === activeId ? 1000 : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, activeId]);

  return <div ref={el} className={`lmap ${className}`} role="region" aria-label={ariaLabel} />;
}
