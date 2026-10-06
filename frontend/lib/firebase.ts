import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBksjJJoKBWYGhZOhZi9poHkWAMu-cemHI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'duolingo-cbdd2.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'duolingo-cbdd2',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'duolingo-cbdd2.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '927605120831',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:927605120831:web:3ec4202a89875f3ae6fd8a',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-8V7BVCDXKT',
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider with Web Client ID
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '927605120831-as1bsvns78f8ho5hfs884mnl7u1lcrob.apps.googleusercontent.com',
});

// Initialize Analytics (SSR safe)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported or blocked in this environment
    });
}

export async function getFirebaseToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch (err) {
    console.error('Error getting Firebase ID token:', err);
    return null;
  }
}

export { signInWithPopup, signOut, onAuthStateChanged, type User };
