import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { COL, PROPERTIES_TAG, firebaseConfig, firebaseConfigured, firestoreRestBase, useEmulators } from '@/lib/firebase/config';

/**
 * POST /api/revalidate — called by /admin after a save so the public site
 * shows the change immediately instead of after the 5-minute cache.
 *
 * Requires `Authorization: Bearer <Firebase ID token>` from a signed-in user
 * who has a document in the `admins` collection. The token is verified
 * against Google's public keys, so no service-account secret is needed.
 */
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

export async function POST(req: NextRequest) {
  if (!firebaseConfigured) return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

  const pid = firebaseConfig.projectId;
  let uid: string;
  try {
    // Emulator tokens are unsigned; useEmulators is always false in production builds.
    const payload = useEmulators
      ? decodeJwt(token)
      : (await jwtVerify(token, JWKS, { issuer: `https://securetoken.google.com/${pid}`, audience: pid })).payload;
    if (!payload.sub) throw new Error('no sub');
    uid = payload.sub;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Confirm admin status by reading admins/{uid} as that user (rules allow an admin to read their own doc).
  const res = await fetch(
    `${firestoreRestBase()}/${COL.admins}/${encodeURIComponent(uid)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );
  if (!res.ok) return NextResponse.json({ error: 'Not an admin' }, { status: 403 });

  revalidateTag(PROPERTIES_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
