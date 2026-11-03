'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { firebaseConfig, useEmulators } from './config';

let db: Firestore | undefined;

/** Browser Firebase SDK — only used by /admin. */
export function fb() {
  const fresh = !getApps().length;
  const app = fresh ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const storage = getStorage(app);
  if (!db) {
    db = fresh ? initializeFirestore(app, { ignoreUndefinedProperties: true }) : getFirestore(app);
    if (useEmulators) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      connectStorageEmulator(storage, '127.0.0.1', 9199);
    }
  }
  return { app, auth, db, storage };
}
