import type { Property } from '../properties';

/** Firestore REST value decoding + defensive normalisation, shared by the site and /admin. */

export type FsValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } };

export function decodeValue(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return Date.parse(v.timestampValue);
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(decodeValue);
  if ('mapValue' in v) return decodeFields(v.mapValue.fields ?? {});
  return undefined;
}

export function decodeFields(fields: Record<string, FsValue>) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

/** Fill gaps so a partially-filled document can't crash a page. */
export function normalise(id: string, raw: Record<string, unknown>): Property {
  const n = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
  const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const status = str(raw.status, 'Available');
  const support = str(raw.support, 'Medium');
  return {
    id,
    title: str(raw.title, 'Untitled home'),
    area: str(raw.area),
    pc: str(raw.pc),
    type: str(raw.type, 'Shared supported house'),
    beds: n(raw.beds),
    bedsUnit: raw.bedsUnit === 'One-bed flats' ? 'One-bed flats' : 'Bedrooms',
    baths: n(raw.baths),
    bathsUnit: raw.bathsUnit === 'Private bathrooms' ? 'Private bathrooms' : 'Bathrooms',
    rec: n(raw.rec),
    support: (['Low', 'Medium', 'High'].includes(support) ? support : 'Medium') as Property['support'],
    status: (['Available', 'Coming soon', 'Full'].includes(status) ? status : 'Available') as Property['status'],
    ord: n(raw.ord),
    avail: str(raw.avail),
    staff: str(raw.staff),
    suitable: str(raw.suitable),
    la: str(raw.la),
    photos: n(raw.photos),
    mx: n(raw.mx, 50),
    my: n(raw.my, 50),
    summary: str(raw.summary),
    features: arr<string>(raw.features).filter((x) => typeof x === 'string'),
    transport: arr<unknown>(raw.transport)
      .map((t) => (Array.isArray(t) ? t : t && typeof t === 'object' ? [(t as { place?: string }).place, (t as { time?: string }).time] : []))
      .filter((t): t is [string, string] => typeof t[0] === 'string')
      .map(([a, b]) => [a, b ?? ''] as [string, string]),
    images: arr<{ url?: string; path?: string }>(raw.images)
      .filter((i) => i && typeof i.url === 'string')
      .map((i) => ({ url: i.url as string, path: i.path ?? '' })),
    updatedAt: n(raw.updatedAt) || undefined,
  };
}

/** Shape written to Firestore (no nested arrays — transport becomes maps). */
export function toFirestore(p: Property) {
  const { id, transport, images, ...rest } = p;
  return {
    ...rest,
    id,
    transport: transport.map(([place, time]) => ({ place, time })),
    images: (images ?? []).map(({ url, path }) => ({ url, path })),
    photos: images?.length ? images.length : rest.photos,
    updatedAt: Date.now(),
  };
}
