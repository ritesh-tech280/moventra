"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  registerWithFirebase,
  loginWithFirebase,
  signInWithGoogle,
  logoutFromFirebase,
} from "@/lib/firebase";

export interface RiderProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  authProvider: "email" | "google" | "phone";
  photoURL?: string;
  role?: string;
  createdAt?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  rider: RiderProfile | null;
  firebaseUser: User | null;
  token: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  registerRider: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  loginRider: (data: LoginData) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogleProvider: (customPhone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Fetch rider profile from backend using stored JWT token
  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rider) {
          setRider(data.rider);
        }
      } else if (res.status === 401) {
        // Token expired
        localStorage.removeItem("moventra_token");
        setToken(null);
        setRider(null);
      }
    } catch (err) {
      console.warn("[AuthContext] Backend server not reachable yet. Stored rider profile will be used:", err);
    }
  };

  // On initial mount, restore token and listen to Firebase auth changes
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("moventra_token") : null;
    const savedRider = typeof window !== "undefined" ? localStorage.getItem("moventra_rider") : null;

    if (savedToken) {
      setToken(savedToken);
      if (savedRider) {
        try {
          setRider(JSON.parse(savedRider));
        } catch (e) {
          // ignore parsing error
        }
      }
      fetchProfile(savedToken);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register a new Rider:
   * 1. Creates Firebase user for authentication security
   * 2. Persists Rider profile in MongoDB via backend MVC with hashed password
   */
  const registerRider = async ({ name, email, phone, password }: RegisterData) => {
    try {
      // 1. Firebase Authentication registration
      let fbUser: User;
      try {
        fbUser = await registerWithFirebase(email, password);
      } catch (fbErr: any) {
        // If user already exists in Firebase, continue to ensure MongoDB sync or show error
        if (fbErr.code === "auth/email-already-in-use") {
          throw new Error("This email is already registered in Firebase. Please log in instead.");
        }
        throw new Error(fbErr.message || "Firebase registration failed.");
      }

      // 2. Call backend MVC API to store Rider in MongoDB with hashed password
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password, // Backend pre-save hook hashes this with bcrypt
          firebaseUid: fbUser.uid,
          authProvider: "email",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save rider profile in database.");
      }

      // Save token and Rider in state & localStorage
      setToken(result.token);
      setRider(result.rider);
      localStorage.setItem("moventra_token", result.token);
      localStorage.setItem("moventra_rider", JSON.stringify(result.rider));
      closeAuthModal();

      return { success: true, message: result.message };
    } catch (err: any) {
      console.error("[Registration Error]:", err);
      return { success: false, message: err.message || "Registration failed." };
    }
  };

  /**
   * Log in an existing Rider:
   * 1. Authenticates through Firebase
   * 2. Validates credentials with MongoDB backend and retrieves profile
   */
  const loginRider = async ({ email, password }: LoginData) => {
    try {
      // 1. Authenticate with Firebase
      let fbUser: User | null = null;
      try {
        fbUser = await loginWithFirebase(email, password);
      } catch (fbErr: any) {
        console.warn("[Firebase Login Notice]:", fbErr.message);
      }

      // 2. Validate with MongoDB backend
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firebaseUid: fbUser ? fbUser.uid : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid login credentials.");
      }

      setToken(result.token);
      setRider(result.rider);
      localStorage.setItem("moventra_token", result.token);
      localStorage.setItem("moventra_rider", JSON.stringify(result.rider));
      closeAuthModal();

      return { success: true, message: "Logged in successfully." };
    } catch (err: any) {
      console.error("[Login Error]:", err);
      return { success: false, message: err.message || "Login failed." };
    }
  };

  /**
   * Google Sign-In with automatic synchronization into MongoDB
   */
  const loginWithGoogleProvider = async (customPhone?: string) => {
    try {
      // 1. Popup Google Authentication
      const user = await signInWithGoogle();

      // 2. Synchronize with MongoDB backend
      const response = await fetch(`${API_BASE}/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName || "Google Traveler",
          photoURL: user.photoURL || "",
          phone: customPhone || user.phoneNumber || "",
          authProvider: "google",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to synchronize Google account with MongoDB.");
      }

      setToken(result.token);
      setRider(result.rider);
      localStorage.setItem("moventra_token", result.token);
      localStorage.setItem("moventra_rider", JSON.stringify(result.rider));
      closeAuthModal();

      return { success: true, message: "Signed in with Google successfully." };
    } catch (err: any) {
      console.error("[Google Auth Error]:", err);
      return { success: false, message: err.message || "Google sign-in failed." };
    }
  };

  /**
   * Log out rider
   */
  const logout = async () => {
    try {
      await logoutFromFirebase();
    } catch (e) {
      // ignore
    }
    setRider(null);
    setFirebaseUser(null);
    setToken(null);
    localStorage.removeItem("moventra_token");
    localStorage.removeItem("moventra_rider");
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        rider,
        firebaseUser,
        token,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        registerRider,
        loginRider,
        loginWithGoogleProvider,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

