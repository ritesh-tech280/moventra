import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBWFiM0EQ6YPTCivKzuU8z4LBEDcR8eyC4",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "moventra-aed88.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "moventra-aed88",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "moventra-aed88.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "259251024630",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:259251024630:web:14a0f02e32b4af048cb2d7",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MN2PB25TL1",
};

// Initialize Firebase client safely for both SSR and browser
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Sign in with Google Popup
 */
export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Register with Email and Password in Firebase
 */
export const registerWithFirebase = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

/**
 * Log in with Email and Password in Firebase
 */
export const loginWithFirebase = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

/**
 * Log out from Firebase
 */
export const logoutFromFirebase = async (): Promise<void> => {
  await signOut(auth);
};

export default app;

