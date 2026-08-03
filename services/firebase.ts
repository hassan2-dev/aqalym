import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const isDemoMode =
  process.env.EXPO_PUBLIC_DEMO_MODE === 'true' ||
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (isDemoMode) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (isDemoMode) return null;
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (isDemoMode) return null;
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (isDemoMode) return null;
  if (storage) return storage;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  storage = getStorage(firebaseApp);
  return storage;
}

/** Placeholder for wiring AsyncStorage persistence in production builds. */
export const authPersistenceStorage = AsyncStorage;
