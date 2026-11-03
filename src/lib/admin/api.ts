'use client';

import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { User } from 'firebase/auth';
import { fb } from '../firebase/client';
import { COL } from '../firebase/config';
import { normalise, toFirestore } from '../firebase/normalise';
import { SAMPLE_PROPERTIES, byOrder, type Property, type PropertyImage } from '../properties';

export async function isAdmin(uid: string) {
  const snap = await getDoc(doc(fb().db, COL.admins, uid));
  return snap.exists();
}

export async function listHouses(): Promise<Property[]> {
  const snap = await getDocs(collection(fb().db, COL.properties));
  return snap.docs.map((d) => normalise(d.id, d.data())).sort(byOrder);
}

export async function getHouse(id: string): Promise<Property | null> {
  const snap = await getDoc(doc(fb().db, COL.properties, id));
  return snap.exists() ? normalise(snap.id, snap.data()) : null;
}

export async function saveHouse(p: Property) {
  await setDoc(doc(fb().db, COL.properties, p.id), toFirestore(p));
}

export async function deleteHouse(p: Property) {
  await deleteDoc(doc(fb().db, COL.properties, p.id));
  await Promise.all((p.images ?? []).map((i) => deleteImage(i.path)));
}

export async function importSamples() {
  const batch = writeBatch(fb().db);
  SAMPLE_PROPERTIES.forEach((p) => batch.set(doc(fb().db, COL.properties, p.id), toFirestore(p)));
  await batch.commit();
}

/** Next free reference, e.g. AH-107. */
export function nextId(list: Property[]) {
  const max = list.reduce((m, p) => Math.max(m, Number(/^AH-(\d+)$/i.exec(p.id)?.[1] ?? 0)), 100);
  return `AH-${max + 1}`;
}

/** Downscale large photos in the browser before upload (max 2000px, JPEG). */
async function shrink(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1.5e6) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', 0.85));
  } catch {
    return file;
  }
}

export async function uploadImage(houseId: string, file: File): Promise<PropertyImage> {
  const blob = await shrink(file);
  const ext = blob.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'img').toLowerCase();
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'photo';
  const path = `properties/${houseId}/${Date.now()}-${base}.${ext}`;
  const r = ref(fb().storage, path);
  await uploadBytes(r, blob, { contentType: blob.type || file.type });
  return { url: await getDownloadURL(r), path };
}

export async function deleteImage(path: string) {
  if (!path) return;
  try {
    await deleteObject(ref(fb().storage, path));
  } catch (e) {
    // Already gone is fine; anything else is logged but doesn't block the save.
    if ((e as { code?: string }).code !== 'storage/object-not-found') console.warn('[admin] delete image failed', e);
  }
}

/** Ask the server to refresh cached public pages now. Returns false if it couldn't. */
export async function refreshSite(user: User) {
  try {
    const res = await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
    return res.ok;
  } catch {
    return false;
  }
}
