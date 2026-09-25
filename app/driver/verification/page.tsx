"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileUp, ShieldCheck } from "lucide-react";
import { DRIVER_TOKEN_KEY } from "@/lib/driverApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MAX_SIZE = 8 * 1024 * 1024;
const sections = [
  { type: "DRIVING_LICENSE", title: "Driving License", number: "License Number" },
  { type: "VEHICLE_RC", title: "Vehicle RC", number: "Registration Number" },
  { type: "VEHICLE_INSURANCE", title: "Insurance", number: "Policy Number" },
  { type: "POLLUTION_CERTIFICATE", title: "Pollution Certificate", number: "Certificate Number" },
] as const;
type Document = { _id: string; documentType: string; documentNumber: string; verificationStatus: string; rejectionReason?: string | null; originalFileName: string };
type Entry = { documentNumber: string; file: File | null };

async function api(token: string, path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, { ...options, cache: "no-store", headers: { Authorization: `Bearer ${token}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Request failed. Please try again.");
  return body;
}
function asDataUri(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unable to read file.")); reader.onerror = () => reject(new Error("Unable to read file.")); reader.readAsDataURL(file); }); }

export default function DriverVerificationPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (authToken: string) => {
    setLoading(true); setError("");
    try {
      const result = await api(authToken, "/driver/documents");
      setDocuments(result.documents || []);
      setEntries(Object.fromEntries((result.documents || []).map((doc: Document) => [doc.documentType, { documentNumber: doc.documentNumber, file: null }])));
    } catch (issue) {
      const message = issue instanceof Error ? issue.message : "Unable to load documents.";
      setError(message);
      if (message.includes("authorized") || message.includes("token")) { localStorage.removeItem(DRIVER_TOKEN_KEY); router.replace("/driver/login"); }
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { const saved = localStorage.getItem(DRIVER_TOKEN_KEY); if (!saved) { router.replace("/driver/login"); return; } setToken(saved); void load(saved); }, [load, router]);

  const upload = async (type: string) => {
    const entry = entries[type];
    if (!entry?.documentNumber.trim()) { setError("Enter the document number before uploading."); return; }
    if (!entry.file) { setError("Choose a document file to upload."); return; }
    if (entry.file.size > MAX_SIZE) { setError("Files must be 8 MB or smaller."); return; }
    setBusy(type); setError(""); setNotice("");
    try {
      await api(token, "/driver/documents", { method: "POST", body: JSON.stringify({ documentType: type, documentNumber: entry.documentNumber, originalName: entry.file.name, file: await asDataUri(entry.file) }) });
      setNotice("Document uploaded and queued for admin review."); await load(token);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Upload failed."); }
    finally { setBusy(""); }
  };

  const submit = async () => { setBusy("submit"); setError(""); setNotice(""); try { const result = await api(token, "/driver/verification/submit", { method: "POST", body: "{}" }); setNotice(result.message); await load(token); } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to submit verification."); } finally { setBusy(""); } };

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-3xl animate-pulse rounded-2xl bg-white p-8 text-slate-400">Loading your verification documents…</div></main>;
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-3xl">
    <button onClick={() => router.push("/driver/dashboard")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-800"><ArrowLeft size={16}/> Driver dashboard</button>
    <header className="mb-6 rounded-2xl bg-emerald-950 p-6 text-white sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10"><ShieldCheck size={25}/></span><div><p className="text-sm font-semibold text-emerald-200">Driver verification</p><h1 className="mt-1 text-2xl font-extrabold">Upload your documents</h1><p className="mt-2 text-sm text-emerald-100">Upload clear JPG, PNG, or PDF files up to 8 MB. Our team will review each document.</p></div></div></header>
    {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}
    <div className="space-y-4">{sections.map((section) => { const doc = documents.find((item) => item.documentType === section.type); const entry = entries[section.type] || { documentNumber: doc?.documentNumber || "", file: null }; const locked = doc?.verificationStatus === "approved"; return <section key={section.type} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{section.title}</h2><p className="mt-1 text-xs text-slate-500">JPG, PNG or PDF · Maximum 8 MB</p></div>{doc && <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${doc.verificationStatus === "approved" ? "bg-emerald-100 text-emerald-800" : doc.verificationStatus === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{doc.verificationStatus}</span>}</div>
      {doc?.verificationStatus === "rejected" && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-800"><strong>{section.title} rejected.</strong><p className="mt-1">Reason: {doc.rejectionReason || "Please upload a clearer or corrected document."}</p><p className="mt-1 font-semibold">Upload a new document to resubmit.</p></div>}
      {locked && <p className="mt-4 flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 size={17}/> Approved by our verification team</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="block text-sm font-medium text-slate-700">{section.number}<input disabled={locked} value={entry.documentNumber} onChange={(event) => setEntries((old) => ({ ...old, [section.type]: { ...entry, documentNumber: event.target.value } }))} maxLength={100} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700" placeholder={`Enter ${section.number.toLowerCase()}`}/></label><label className="block text-sm font-medium text-slate-700">{doc && doc.verificationStatus !== "rejected" ? "Replace file" : "Choose document"}<input disabled={locked} type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(event) => setEntries((old) => ({ ...old, [section.type]: { ...entry, file: event.target.files?.[0] || null } }))} className="mt-1.5 block w-full rounded-xl border border-slate-300 px-2 py-2 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-2 file:py-1.5 file:font-semibold"/>{entry.file && <span className="mt-1 block truncate text-xs text-slate-500">{entry.file.name}</span>}</label><button disabled={locked || busy === section.type} onClick={() => void upload(section.type)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"><FileUp size={16}/>{busy === section.type ? "Uploading…" : doc?.verificationStatus === "rejected" ? "Re-upload" : "Upload"}</button></div>
    </section>; })}</div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-600">All four documents are required before you can submit for review.</p><button onClick={() => void submit()} disabled={busy !== ""} className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">{busy === "submit" ? "Submitting…" : "Submit verification"}</button></div>
  </div></main>;
}
