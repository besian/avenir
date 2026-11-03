/**
 * Firebase web config, read from NEXT_PUBLIC_FIREBASE_* env vars (see
 * .env.example). These values are safe to expose: access is controlled by
 * the Firestore/Storage security rules in firestore.rules / storage.rules.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/**
 * Local Firebase emulators (development only): set NEXT_PUBLIC_FIREBASE_EMULATORS=1
 * and run `npx firebase emulators:start`. Ignored in production builds.
 */
export const useEmulators = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1';

export const firestoreRestBase = () =>
  `${useEmulators ? 'http://127.0.0.1:8080' : 'https://firestore.googleapis.com'}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

/** Firestore collection names. */
export const COL = { properties: 'properties', admins: 'admins' } as const;

/** Cache tag for every page that shows property data. */
export const PROPERTIES_TAG = 'properties';
