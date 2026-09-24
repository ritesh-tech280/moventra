"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CarIcon, ShieldCheckIcon } from "@/icons/page";
import { driverLogin, DRIVER_TOKEN_KEY } from "@/lib/driverApi";

export default function DriverLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await driverLogin(email, password);
      window.localStorage.setItem(DRIVER_TOKEN_KEY, result.token);
      router.replace("/driver/dashboard");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100 via-slate-50 to-teal-100" />
    <section className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-7 shadow-xl shadow-emerald-950/10 backdrop-blur sm:p-9">
      <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-white"><CarIcon size={24} /></span><div><p className="text-sm font-extrabold text-slate-950">MOVENTRA</p><p className="text-[10px] font-bold tracking-[0.15em] text-emerald-800">DRIVER PARTNER</p></div></div>
      <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-slate-950">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage your driver account and vehicle.</p>
      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Email address<input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="block text-sm font-semibold text-slate-700">Password<input type="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500"><ShieldCheckIcon size={15} />Your driver account is protected with secure sign in.</p>
    </section>
  </main>;
}
