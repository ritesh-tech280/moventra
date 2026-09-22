"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CloseIcon,
  CarIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@/icons/page";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginRider,
    registerRider,
    loginWithGoogleProvider,
  } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === "register") {
        // Validation for registration: Name, Email, Phone, Password
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }
        if (!email.trim()) {
          throw new Error("Please enter your email address.");
        }
        if (!phone.trim()) {
          throw new Error("Please enter your phone number.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        const res = await registerRider({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        });

        if (!res.success) {
          setError(res.message || "Registration failed.");
        }
      } else {
        // Login: Email and Password
        if (!email.trim() || !password) {
          throw new Error("Please enter both email and password.");
        }

        const res = await loginRider({
          email: email.trim(),
          password,
        });

        if (!res.success) {
          setError(res.message || "Invalid credentials.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogleProvider(phone.trim() || undefined);
      if (!res.success) {
        setError(res.message || "Google sign-in failed.");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in encountered an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-7 sm:p-9 text-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <CloseIcon size={20} />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <CarIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {authModalMode === "register" ? "Create Rider Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-slate-500">
              {authModalMode === "register"
                ? "Join Moventra to unlock guaranteed fares & live tracking"
                : "Log in to manage your rides and scheduled bookings"}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              openAuthModal("login");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalMode === "login"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal("register");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalMode === "register"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Google Sign-in Action */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {authModalMode === "register" ? "Sign up with Google" : "Sign in with Google"}
          </span>
        </button>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            or with email
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name field (only for registration) */}
          {authModalMode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
              required
            />
          </div>

          {/* Phone field (required in register mode) */}
          {authModalMode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
              required
              minLength={6}
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Synchronizing with MongoDB...
              </span>
            ) : (
              <>
                <span>
                  {authModalMode === "register" ? "Complete Registration" : "Log In to Moventra"}
                </span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Reassurance Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheckIcon size={14} className="text-blue-600" />
            256-bit SSL & BCrypt Hashed
          </span>
          <button
            type="button"
            onClick={() => {
              openAuthModal(authModalMode === "login" ? "register" : "login");
              setError(null);
            }}
            className="text-blue-600 hover:underline font-bold"
          >
            {authModalMode === "login"
              ? "New to Moventra? Register"
              : "Already registered? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}