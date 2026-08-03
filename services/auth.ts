import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PhoneAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type ConfirmationResult,
} from 'firebase/auth';

import { upsertUser } from '@/services/catalog';
import { getFirebaseAuth, isDemoMode } from '@/services/firebase';
import type { User } from '@/types/models';

const SESSION_KEY = '@aqalym/session';
const DEMO_OTP = '123456';

type DemoConfirmation = {
  verificationId: string;
  phone: string;
};

let demoConfirmation: DemoConfirmation | null = null;
let firebaseConfirmation: ConfirmationResult | null = null;

export function normalizeIraqiPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('964')) return `+${digits}`;
  if (digits.startsWith('0')) return `+964${digits.slice(1)}`;
  if (digits.startsWith('7') && digits.length === 10) return `+964${digits}`;
  return `+964${digits}`;
}

export function isValidIraqiPhone(input: string): boolean {
  const normalized = normalizeIraqiPhone(input);
  return /^\+9647\d{9}$/.test(normalized);
}

export async function sendOtp(phoneInput: string): Promise<{ phone: string }> {
  const phone = normalizeIraqiPhone(phoneInput);
  if (!isValidIraqiPhone(phoneInput)) {
    throw new Error('INVALID_PHONE');
  }

  if (isDemoMode) {
    demoConfirmation = { verificationId: `demo-${Date.now()}`, phone };
    await new Promise((r) => setTimeout(r, 800));
    return { phone };
  }

  const auth = getFirebaseAuth();
  if (!auth) throw new Error('AUTH_UNAVAILABLE');

  // Native phone auth requires ApplicationVerifier / reCAPTCHA in production builds.
  // Wire your Expo development-build verifier here when Firebase is configured.
  throw new Error('PHONE_AUTH_REQUIRES_NATIVE_BUILD');
}

export async function verifyOtp(code: string): Promise<User> {
  const now = new Date().toISOString();

  if (isDemoMode) {
    if (!demoConfirmation) throw new Error('NO_PENDING_OTP');
    if (code.trim() !== DEMO_OTP) throw new Error('INVALID_OTP');

    const user: User = {
      id: `user-${demoConfirmation.phone.replace(/\D/g, '')}`,
      phone: demoConfirmation.phone,
      createdAt: now,
      updatedAt: now,
    };
    await upsertUser(user);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    demoConfirmation = null;
    return user;
  }

  const auth = getFirebaseAuth();
  if (!auth || !firebaseConfirmation) throw new Error('NO_PENDING_OTP');

  const credential = PhoneAuthProvider.credential(
    firebaseConfirmation.verificationId,
    code.trim(),
  );
  const result = await signInWithCredential(auth, credential);
  const user: User = {
    id: result.user.uid,
    phone: result.user.phoneNumber ?? '',
    createdAt: now,
    updatedAt: now,
  };
  await upsertUser(user);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  firebaseConfirmation = null;
  return user;
}

export async function getStoredSession(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
  }
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  let active = true;

  (async () => {
    const session = await getStoredSession();
    if (active) callback(session);
  })();

  const auth = getFirebaseAuth();
  if (!auth || isDemoMode) {
    return () => {
      active = false;
    };
  }

  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    if (!active) return;
    if (!fbUser) {
      callback(null);
      return;
    }
    const now = new Date().toISOString();
    const user: User = {
      id: fbUser.uid,
      phone: fbUser.phoneNumber ?? '',
      createdAt: now,
      updatedAt: now,
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    callback(user);
  });

  return () => {
    active = false;
    unsub();
  };
}

export { DEMO_OTP };
