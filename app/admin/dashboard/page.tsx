"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  Clock3,
  DollarSign,
  RefreshCw,
  Users,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";

type Stats = {
  drivers: {
    total: number;
    active: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  vehicles: { total: number; active: number; pending: number };
  riders: { total: number };
  rides: {
    total: number;
    completed: number;
    pending: number;
    ongoing: number;
    cancelled: number;
  };
  revenue: { total: number; today: number };
};
type Driver = {
  _id: string;
  name: string;
  email: string;
  status: string;
  verification: { status: string };
  createdAt: string;
};
type Ride = {
  _id: string;
  status: string;
  pickup: any;
  destination: any;
  finalFare: number;
  createdAt: string;
  riderId?: { name: string };
  driverId?: { name: string };
};
type Point = { _id: string; rides?: number; revenue?: number };
const cards = (s: Stats) => [
  {
    label: "Total drivers",
    value: s.drivers.total,
    sub: `${s.drivers.active} active`,
    icon: Users,
    color: "emerald",
    href: "/admin/drivers",
  },
  {
    label: "Vehicles",
    value: s.vehicles.total,
    sub: `${s.vehicles.pending} verification pending`,
    icon: CarFront,
    color: "indigo",
    href: "/admin/vehicles",
  },
  {
    label: "Total rides",
    value: s.rides.total,
    sub: `${s.rides.ongoing} currently ongoing`,
    icon: Activity,
    color: "blue",
    href: "/admin/rides",
  },
  {
    label: "Total revenue",
    value: `₹${s.revenue.total.toLocaleString()}`,
    sub: `₹${s.revenue.today.toLocaleString()} today`,
    icon: DollarSign,
    color: "amber",
    href: "/admin/rides",
  },
];
function Stat({
  label,
  value,
  sub,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: any;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        <span
          className={`grid size-10 place-items-center rounded-xl ${color === "emerald" ? "bg-emerald-50 text-emerald-700" : color === "indigo" ? "bg-indigo-50 text-indigo-700" : color === "blue" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}
        >
          <Icon size={19} />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{sub}</span>
        <ArrowRight
          size={15}
          className="text-slate-300 group-hover:text-emerald-700"
        />
      </div>
    </Link>
  );
}
export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pending, setPending] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [rideSeries, setRideSeries] = useState<Point[]>([]);
  const [revenueSeries, setRevenueSeries] = useState<Point[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, d, p, r, rc, vc, a] = await Promise.all([
        adminApi<Stats>("/dashboard/stats"),
        adminApi<{ drivers: Driver[]; pagination: any }>(
          "/drivers?page=1&limit=5",
        ),
        adminApi<{ drivers: Driver[]; pagination: any }>(
          "/drivers/pending?page=1&limit=5",
        ),
        adminApi<{ rides: Ride[]; pagination: any }>("/rides?page=1&limit=5"),
        adminApi<{ data: Point[] }>("/dashboard/rides-chart?days=14"),
        adminApi<{ data: Point[] }>("/dashboard/revenue-chart?days=14"),
        adminApi<{ activities: any[] }>("/dashboard/activity"),
      ]);
      setStats(s);
      setDrivers(d.drivers);
      setPending(p.drivers);
      setRides(r.rides);
      setRideSeries(rc.data);
      setRevenueSeries(vc.data);
      setActivities(a.activities);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-emerald-700">
            Fleet overview
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            A current view of your operations and activity.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          Refresh data
        </button>
      </div>
      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load dashboard data. {error}
          <button onClick={load} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}
      {loading && !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : (
        stats && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards(stats).map((c) => (
                <Stat key={c.label} {...c} />
              ))}
            </section>
            <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Approved drivers</div>
                <div className="mt-1 flex items-center gap-2 text-xl font-bold">
                  {stats.drivers.approved}
                  <CheckCircle2 size={17} className="text-emerald-600" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Pending drivers</div>
                <div className="mt-1 flex items-center gap-2 text-xl font-bold">
                  {stats.drivers.pending}
                  <Clock3 size={17} className="text-amber-600" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Total riders</div>
                <div className="mt-1 text-xl font-bold">
                  {stats.riders.total}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Ride outcomes</div>
                <div className="mt-1 text-sm">
                  <b className="text-emerald-700">{stats.rides.completed}</b>{" "}
                  completed <span className="px-1 text-slate-300">·</span>
                  <b className="text-red-600">{stats.rides.cancelled}</b>{" "}
                  cancelled
                </div>
              </div>
            </section>
            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <Chart
                title="Ride volume · last 14 days"
                data={rideSeries}
                field="rides"
                color="bg-indigo-500"
                money={false}
              />
              <Chart
                title="Revenue · last 14 days"
                data={revenueSeries}
                field="revenue"
                color="bg-emerald-600"
                money
              />
              <RideDistribution stats={stats} />
            </section>
            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Recent drivers
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest registrations
                    </p>
                  </div>
                  <Link
                    href="/admin/drivers"
                    className="text-sm font-semibold text-emerald-700"
                  >
                    View all
                  </Link>
                </div>
                {loading ? (
                  <Loading />
                ) : drivers.length ? (
                  drivers.map((d) => (
                    <Link
                      key={d._id}
                      href={`/admin/drivers/${d._id}`}
                      className="flex items-center justify-between border-b border-slate-50 px-5 py-3.5 last:border-0 hover:bg-slate-50"
                    >
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.email}</div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                ) : (
                  <Empty text="No drivers registered yet." />
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Pending verification
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Drivers requiring review
                    </p>
                  </div>
                  <Link
                    href="/admin/drivers?status=under_review"
                    className="text-sm font-semibold text-indigo-700"
                  >
                    Review queue
                  </Link>
                </div>
                {loading ? (
                  <Loading />
                ) : pending.length ? (
                  pending.map((d) => (
                    <Link
                      key={d._id}
                      href={`/admin/drivers/${d._id}`}
                      className="flex items-center justify-between border-b border-slate-50 px-5 py-3.5 last:border-0 hover:bg-slate-50"
                    >
                      <div>
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-slate-500">
                          Submitted {new Date(d.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        {d.verification?.status?.replaceAll("_", " ")}
                      </span>
                    </Link>
                  ))
                ) : (
                  <Empty text="No pending driver verifications." />
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Recent rides
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest trips from the ride collection
                    </p>
                  </div>
                  <Link
                    href="/admin/rides"
                    className="text-sm font-semibold text-indigo-700"
                  >
                    View all
                  </Link>
                </div>
                {loading ? (
                  <Loading />
                ) : rides.length ? (
                  <div className="divide-y divide-slate-50">
                    {rides.map((r) => (
                      <Link
                        key={r._id}
                        href={`/admin/rides/${r._id}`}
                        className="grid gap-2 px-5 py-3.5 text-sm sm:grid-cols-4 sm:items-center hover:bg-slate-50"
                      >
                        <span className="truncate font-mono text-xs text-slate-500">
                          {r._id}
                        </span>
                        <span>
                          {r.riderId?.name || "Rider"}{" "}
                          <span className="text-slate-300">→</span>{" "}
                          {r.driverId?.name || "Unassigned"}
                        </span>
                        <span className="capitalize text-slate-600">
                          {r.status?.toLowerCase().replaceAll("_", " ")}
                        </span>
                        <span className="sm:text-right">
                          {r.finalFare == null
                            ? "—"
                            : `₹${Number(r.finalFare).toLocaleString()}`}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty text="No rides in the database yet." />
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="font-semibold text-slate-900">
                    Recent activity
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Drivers, riders, rides, and verification audit events
                  </p>
                </div>
                {activities.length ? (
                  activities.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between gap-3 border-b border-slate-50 px-5 py-3 text-sm last:border-0"
                    >
                      <span>
                        {a.action.replaceAll("_", " ")} · {a.subject}
                      </span>
                      <time className="shrink-0 text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  ))
                ) : (
                  <Empty text="No recent activity." />
                )}
              </div>
            </section>
            <section className="mt-5 grid gap-4 md:grid-cols-3">
              <Quick
                href="/admin/vehicles"
                title="Fleet verification"
                desc={`${stats.vehicles.pending} vehicles waiting for review`}
                icon={CarFront}
              />
              <Quick
                href="/admin/rides"
                title="Ongoing rides"
                desc={`${stats.rides.ongoing} trips currently in progress`}
                icon={ArrowUpRight}
              />
              <Quick
                href="/admin/drivers"
                title="Rejected drivers"
                desc={`${stats.drivers.rejected} driver accounts rejected`}
                icon={ArrowDownRight}
              />
            </section>
          </>
        )
      )}
    </div>
  );
}
function Loading() {
  return (
    <div className="space-y-3 p-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="p-8 text-center text-sm text-slate-500">{text}</p>;
}
function Quick({
  href,
  title,
  desc,
  icon: Icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-200"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
        <Icon size={18} />
      </span>
      <span>
        <b className="text-sm">{title}</b>
        <span className="mt-1 block text-xs text-slate-500">{desc}</span>
      </span>
    </Link>
  );
}
function Chart({
  title,
  data,
  field,
  color,
  money,
}: {
  title: string;
  data: Point[];
  field: "rides" | "revenue";
  color: string;
  money: boolean;
}) {
  const max = Math.max(...data.map((p) => p[field] || 0), 1);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {data.length ? (
        <div className="mt-5 flex h-36 items-end gap-1.5">
          {data.map((p) => (
            <div
              key={p._id}
              title={`${new Date(`${p._id}T00:00:00`).toLocaleDateString()}: ${money ? `₹${(p[field] || 0).toLocaleString()}` : p[field]}`}
              className="group flex h-full flex-1 flex-col justify-end"
            >
              <div
                className={`w-full rounded-t-md ${color} opacity-80 transition group-hover:opacity-100`}
                style={{
                  height: `${Math.max(((p[field] || 0) / max) * 100, 2)}%`,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-400">
          No chart data available.
        </p>
      )}
      <div className="mt-3 flex justify-between text-[10px] text-slate-400">
        {data.length > 0 && (
          <>
            <span>
              {new Date(`${data[0]._id}T00:00:00`).toLocaleDateString()}
            </span>
            <span>
              {new Date(
                `${data[data.length - 1]._id}T00:00:00`,
              ).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
function RideDistribution({ stats }: { stats: Stats }) {
  const total = stats.rides.total;
  const rows = [
    ["Completed", stats.rides.completed, "bg-emerald-600"],
    ["Cancelled", stats.rides.cancelled, "bg-red-500"],
    ["Ongoing", stats.rides.ongoing, "bg-indigo-500"],
    ["Pending", stats.rides.pending, "bg-amber-500"],
  ] as const;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">Ride status distribution</h2>
      {total ? (
        <div className="mt-5 space-y-4">
          {rows.map(([label, count, color]) => (
            <div key={label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${Math.min(100, (count / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-400">
          No ride status data available.
        </p>
      )}
    </section>
  );
}
