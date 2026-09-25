"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

type Row = Record<string, any>;
const config: Record<
  string,
  {
    title: string;
    description: string;
    key: string;
    columns: [string, string][];
    search: string[];
    filters: [string, string, string[]][];
  }
> = {
  drivers: {
    title: "Drivers",
    description: "Review driver accounts and verification progress.",
    key: "drivers",
    columns: [
      ["Driver", "name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Vehicle", "vehicle"],
      ["Verification", "verification.status"],
      ["Account", "status"],
      ["Joined", "createdAt"],
    ],
    search: ["Search name, email or phone", "search"],
    filters: [
      [
        "Account status",
        "status",
        ["pending", "active", "rejected", "suspended"],
      ],
      [
        "Verification",
        "verification",
        ["pending", "under_review", "approved", "rejected", "incomplete"],
      ],
    ],
  },
  vehicles: {
    title: "Vehicles",
    description: "Fleet vehicles and verification status.",
    key: "vehicles",
    columns: [
      ["Vehicle", "vehicle"],
      ["Driver", "driverId.name"],
      ["Registration", "registrationNumber"],
      ["Type", "vehicleType"],
      ["Verification", "verificationStatus"],
      ["Created", "createdAt"],
    ],
    search: ["Search registration, make or model", "search"],
    filters: [["Verification", "status", ["pending", "approved", "rejected"]]],
  },
  riders: {
    title: "Riders",
    description: "Rider accounts registered on the platform.",
    key: "riders",
    columns: [
      ["Name", "name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Total rides", "totalRides"],
      ["Completed", "completedRides"],
      ["Cancelled", "cancelledRides"],
      ["Account", "status"],
      ["Joined", "createdAt"],
    ],
    search: ["Search name, email or phone", "search"],
    filters: [],
  },
  rides: {
    title: "Rides",
    description: "Trip activity, status and payment records.",
    key: "rides",
    columns: [
      ["Ride", "_id"],
      ["Rider", "riderId.name"],
      ["Driver", "driverId.name"],
      ["Pickup", "pickup"],
      ["Destination", "destination"],
      ["Fare", "finalFare"],
      ["Payment", "paymentStatus"],
      ["Status", "status"],
      ["Created", "createdAt"],
    ],
    search: ["Filter by driver/rider ID", "driver"],
    filters: [
      [
        "Ride status",
        "status",
        [
          "REQUESTED",
          "ACCEPTED",
          "DRIVER_ARRIVED",
          "STARTED",
          "COMPLETED",
          "CANCELLED",
        ],
      ],
      ["Payment", "paymentStatus", ["PENDING", "PAID", "FAILED", "REFUNDED"]],
    ],
  },
};
function value(row: Row, path: string) {
  let v: any = row;
  for (const p of path.split(".")) v = v?.[p];
  if (path === "vehicle") {
    const vehicle = row.vehicle ?? row;
    v = [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
  }
  if (["createdAt"].includes(path))
    return v ? new Date(v).toLocaleDateString() : "—";
  if (["finalFare"].includes(path))
    return v == null ? "—" : `₹${Number(v).toLocaleString()}`;
  if (path === "pickup" || path === "destination")
    return typeof v === "string" ? v : v?.address || v?.name || "—";
  return v || "—";
}
export default function AdminList({ type }: { type: keyof typeof config }) {
  const cfg = config[type];
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set(cfg.search[1], search);
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const data = await adminApi<any>(`/${type}?${params}`);
      setRows(data[cfg.key] || []);
      setPages(data.pagination?.pages || 0);
      setTotal(data.pagination?.total || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }, [type, cfg, page, search, filters]);
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);
  const href = (row: Row) =>
    type === "drivers"
      ? `/admin/drivers/${row._id}`
      : type === "rides"
        ? `/admin/rides/${row._id}`
        : null;
  return (
    <section>
      <div className="mb-6">
        <div className="text-sm font-medium text-slate-500">
          Operations / {cfg.title}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{cfg.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{cfg.description}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={cfg.search[0]}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
            />
          </div>
          {cfg.filters.map(([label, key, opts]) => (
            <select
              key={key}
              value={filters[key] || ""}
              onChange={(e) => {
                setFilters({ ...filters, [key]: e.target.value });
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm capitalize text-slate-600"
            >
              <option value="">All {label}</option>
              {opts.map((o) => (
                <option key={o} value={o}>
                  {o.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          ))}
          {type === "rides" && (
            <>
              <input
                aria-label="Filter by rider ID"
                placeholder="Rider ID"
                value={filters.rider || ""}
                onChange={(e) => {
                  setFilters({ ...filters, rider: e.target.value });
                  setPage(1);
                }}
                className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
              <input
                aria-label="Filter by ride date"
                type="date"
                value={filters.date || ""}
                onChange={(e) => {
                  setFilters({ ...filters, date: e.target.value });
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600"
              />
            </>
          )}
          <button
            onClick={load}
            aria-label="Refresh"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        {error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-red-700">
              Unable to load {cfg.title.toLowerCase()}.
            </p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button
              onClick={load}
              className="mt-3 text-sm font-semibold text-emerald-700"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : !rows.length ? (
          <div className="p-14 text-center">
            <p className="font-medium text-slate-700">
              No {cfg.title.toLowerCase()} found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {cfg.columns.map(([label]) => (
                      <th key={label} className="px-4 py-3 font-semibold">
                        {label}
                      </th>
                    ))}
                    {href(rows[0]) && <th className="px-4 py-3">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/70">
                      {cfg.columns.map(([label, key]) => (
                        <td
                          key={key}
                          className="max-w-56 truncate px-4 py-3.5 text-slate-700"
                        >
                          {key === "verification.status" ||
                          key === "status" ||
                          key === "verificationStatus" ||
                          key === "paymentStatus" ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${["approved", "active", "COMPLETED", "PAID"].includes(String(value(row, key))) ? "bg-emerald-50 text-emerald-700" : ["pending", "under_review", "REQUESTED", "ACCEPTED", "STARTED"].includes(String(value(row, key))) ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {String(value(row, key)).replaceAll("_", " ")}
                            </span>
                          ) : (
                            <span
                              className={
                                key === "name"
                                  ? "font-medium text-slate-900"
                                  : ""
                              }
                            >
                              {String(value(row, key))}
                            </span>
                          )}
                        </td>
                      ))}
                      {href(row) && (
                        <td className="px-4 py-3">
                          <Link
                            href={href(row)!}
                            className="font-semibold text-emerald-700 hover:text-emerald-900"
                          >
                            View
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
              <span>
                {total.toLocaleString()} records · Page {page} of{" "}
                {Math.max(1, pages)}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
