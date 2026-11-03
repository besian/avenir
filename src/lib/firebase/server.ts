import 'server-only';
import { COL, PROPERTIES_TAG, firebaseConfig, firebaseConfigured, firestoreRestBase } from './config';
import { SAMPLE_PROPERTIES, byOrder, type Property } from '../properties';
import { decodeFields, normalise, type FsValue } from './normalise';

/**
 * Server-side reads for the public site, via the Firestore REST API.
 * Using fetch (not the SDK) lets Next.js cache the result and refresh it by
 * tag when an admin saves. Reads need `allow read: if true` on properties.
 */

/**
 * All listings, sorted for display. Uses the sample homes when Firebase isn't
 * configured. On a read error it returns an empty list (pages still render,
 * showing "no homes") rather than showing sample homes on a live site.
 */
export async function getProperties(): Promise<Property[]> {
  if (!firebaseConfigured) return SAMPLE_PROPERTIES.slice().sort(byOrder);
  const url = `${firestoreRestBase()}/${COL.properties}?pageSize=300&key=${firebaseConfig.apiKey}`;
  try {
    const res = await fetch(url, { next: { tags: [PROPERTIES_TAG], revalidate: 300 } });
    if (!res.ok) throw new Error(`Firestore ${res.status}`);
    const json = (await res.json()) as { documents?: { name: string; fields?: Record<string, FsValue> }[] };
    return (json.documents ?? [])
      .map((d) => normalise(d.name.split('/').pop() as string, decodeFields(d.fields ?? {})))
      .sort(byOrder);
  } catch (e) {
    console.error('[properties] Firestore read failed, showing no listings:', e);
    return [];
  }
}

export async function getProperty(id: string) {
  const list = await getProperties();
  return list.find((p) => p.id.toLowerCase() === id.toLowerCase());
}
