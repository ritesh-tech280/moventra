"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Eye, FileText, RefreshCw, X } from "lucide-react";
import { adminApi, adminToken } from "@/lib/admin-api";

type Document = {
  _id: string;
  documentType: string;
  documentNumber: string;
  verificationStatus: string;
  rejectionReason?: string | null;
  originalFileName: string;
  mimeType: string;
  createdAt: string;
};
type Data = { driver: any; vehicle: any; documents: Document[] };
type Preview = { url: string; name: string; mimeType: string };
const labels: Record<string, string> = {
  DRIVING_LICENSE: "Driving License",
  VEHICLE_RC: "Vehicle RC",
  VEHICLE_INSURANCE: "Insurance",
  POLLUTION_CERTIFICATE: "Pollution Certificate",
};
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DriverDetail() {
  const { driverId } = useParams<{ driverId: string }>();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState<Document | null>(null);
  const [reason, setReason] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewLoading, setPreviewLoading] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await adminApi<Data>(`/drivers/${driverId}/documents`));
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to load driver documents.",
      );
    } finally {
      setLoading(false);
    }
  }, [driverId]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(
    () => () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    },
    [preview?.url],
  );
  async function review(
    doc: Document,
    decision: "approve" | "reject",
    rejectionReason?: string,
  ) {
    setBusy(true);
    setError("");
    try {
      await adminApi(`/documents/${doc._id}/${decision}`, {
        method: "PATCH",
        body: JSON.stringify(
          decision === "reject" ? { reason: rejectionReason } : {},
        ),
      });
      setRejecting(null);
      setReason("");
      await load();
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Unable to update document.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function view(doc: Document) {
    setError("");
    setPreviewLoading(doc._id);
    try {
      const response = await fetch(`${API}/admin/documents/${doc._id}/view`, {
        headers: { Authorization: `Bearer ${adminToken()}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to open this document.");
      setPreview({
        url: URL.createObjectURL(await response.blob()),
        name: doc.originalFileName,
        mimeType: doc.mimeType,
      });
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to open this document.",
      );
    } finally {
      setPreviewLoading("");
    }
  }
  function closePreview() {
    setPreview(null);
  }
  async function approveDriver() {
    setBusy(true);
    setError("");
    try {
      await adminApi(`/drivers/${driverId}/verification`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      await load();
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Unable to approve driver.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <div className="animate-pulse rounded-2xl bg-white p-8 text-slate-400">
        Loading driver details…
      </div>
    );
  if (!data)
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-slate-600">
        {error || "Driver not found."}
        <button
          className="ml-3 text-emerald-700"
          onClick={() => router.push("/admin/drivers")}
        >
          Back to drivers
        </button>
      </div>
    );
  const { driver, vehicle, documents } = data;
  const allApproved = [
    "DRIVING_LICENSE",
    "VEHICLE_RC",
    "VEHICLE_INSURANCE",
    "POLLUTION_CERTIFICATE",
  ].every((type) =>
    documents.some(
      (doc) =>
        doc.documentType === type && doc.verificationStatus === "approved",
    ),
  );
  return (
    <div>
      <Link
        href="/admin/drivers"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700"
      >
        <ArrowLeft size={16} />
        All drivers
      </Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Driver profile</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {driver.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {driver.phone} · {driver.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold capitalize text-amber-800">
            Verification: {driver.verification?.status || "pending"}
          </span>
          <button
            disabled={
              busy || !allApproved || driver.verification?.status === "approved"
            }
            onClick={() => void approveDriver()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Check size={16} />
            {driver.verification?.status === "approved"
              ? "Driver approved"
              : "Approve driver"}
          </button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Driver information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Info label="Name" value={driver.name} />
          <Info label="Phone" value={driver.phone} />
          <Info label="Email" value={driver.email} />
          <Info
            label="Vehicle registration"
            value={vehicle?.registrationNumber}
          />
        </div>
      </section>
      <div className="mt-5 space-y-4">
        {[
          "DRIVING_LICENSE",
          "VEHICLE_RC",
          "VEHICLE_INSURANCE",
          "POLLUTION_CERTIFICATE",
        ].map((type) => {
          const doc = documents.find((item) => item.documentType === type);
          const numberLabel =
            type === "DRIVING_LICENSE"
              ? "Entered License Number"
              : type === "VEHICLE_RC"
                ? "Entered Registration Number"
                : type === "VEHICLE_INSURANCE"
                  ? "Entered Policy Number"
                  : "Entered Certificate Number";
          return (
            <section
              key={type}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{labels[type]}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {numberLabel}:{" "}
                    <strong className="text-slate-900">
                      {doc?.documentNumber || "Not provided"}
                    </strong>
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${doc?.verificationStatus === "approved" ? "bg-emerald-100 text-emerald-800" : doc?.verificationStatus === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {doc?.verificationStatus || "Missing"}
                </span>
              </div>
              {doc ? (
                <>
                  <p className="mt-2 text-xs text-slate-500">
                    {doc.originalFileName} · Uploaded{" "}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  {doc.rejectionReason && (
                    <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                      Rejection reason: {doc.rejectionReason}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      disabled={previewLoading === doc._id}
                      onClick={() => void view(doc)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Eye size={16} />
                      {previewLoading === doc._id
                        ? "Loading…"
                        : "View document"}
                    </button>
                    {doc.verificationStatus !== "approved" && (
                      <>
                        <button
                          disabled={busy}
                          onClick={() => void review(doc, "approve")}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => {
                            setRejecting(doc);
                            setReason("");
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <FileText size={16} />
                  Driver has not uploaded this document.
                </p>
              )}
            </section>
          );
        })}
      </div>
      <div className="mt-5 flex justify-between">
        <p className="text-sm text-slate-600">
          {allApproved
            ? "All required documents are approved."
            : "Driver verification stays pending until all four documents are approved."}
        </p>
        <button
          onClick={() => void load()}
          className="inline-flex items-center gap-2 text-sm text-slate-500"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      {rejecting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (reason.trim())
                void review(rejecting, "reject", reason.trim());
            }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold">
              Reject {labels[rejecting.documentType] || "document"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Provide a reason the driver can use to correct and re-upload this
              document.
            </p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Rejection reason
              <textarea
                required
                autoFocus
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-red-500"
                placeholder="For example: License number does not match"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setRejecting(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                disabled={busy || !reason.trim()}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Saving…" : "Confirm rejection"}
              </button>
            </div>
          </form>
        </div>
      )}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6"
          onClick={closePreview}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Document preview: ${preview.name}`}
            className="flex h-[40vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  Document preview
                </h2>
                <p className="truncate text-xs text-slate-500">
                  {preview.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closePreview}
                aria-label="Close document preview"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </header>
            <div className="min-h-0 flex-1 bg-slate-100 p-2 sm:p-4">
              {preview.mimeType.startsWith("image/") ? (
                <div className="grid h-full place-items-center">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <iframe
                  title={`Preview of ${preview.name}`}
                  src={preview.url}
                  className="h-full w-full rounded-lg bg-white"
                />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}
