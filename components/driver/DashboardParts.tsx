"use client";

import type { ReactNode } from "react";
import {
  CalendarIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  HeadphonesIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "@/icons/page";
import type {
  DriverDashboardSection,
  DriverDocumentSummary,
  DriverNavigationItem,
  DriverProfile,
  DriverVehicle,
} from "@/types/driver";

const navigation: DriverNavigationItem[] = [
  { id: "dashboard", label: "Dashboard", mobileLabel: "Home" },
  { id: "rides", label: "Ride history", mobileLabel: "Rides" },
  { id: "earnings", label: "Earnings" },
  { id: "profile", label: "My profile", mobileLabel: "Profile" },
  { id: "vehicle", label: "Vehicle" },
  { id: "verification", label: "Verification" },
];

const sectionTitles: Record<DriverDashboardSection, string> = {
  dashboard: "Dashboard",
  rides: "Ride history",
  earnings: "Earnings",
  profile: "My profile",
  vehicle: "Vehicle",
  verification: "Verification",
  settings: "Settings",
};

export function DashboardHeader({
  driver,
  onMenu,
  onLogout,
}: {
  driver: DriverProfile;
  onMenu: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation menu">
            <span className="flex w-5 flex-col gap-1"><span className="h-0.5 rounded bg-current" /><span className="h-0.5 rounded bg-current" /><span className="h-0.5 rounded bg-current" /></span>
          </button>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900 text-white"><CarIcon size={23} /></span>
          <div><p className="text-sm font-extrabold tracking-tight text-slate-950">MOVENTRA</p><p className="text-[10px] font-semibold tracking-[0.16em] text-emerald-800">DRIVER PARTNER</p></div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <button type="button" aria-label="Notifications" className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-600" /></button>
          <span className="hidden text-right sm:block"><span className="block text-sm font-bold text-slate-900">{driver.name}</span><span className="text-xs text-slate-500">Driver account</span></span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900" aria-hidden="true">{driver.name.trim().slice(0, 1).toUpperCase() || "D"}</span>
          <button onClick={onLogout} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block">Log out</button>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({
  active,
  open,
  onSelect,
  onLogout,
}: {
  active: DriverDashboardSection;
  open: boolean;
  onSelect: (section: DriverDashboardSection) => void;
  onLogout: () => void;
}) {
  return <>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="Close navigation menu" onClick={() => onSelect(active)} />}
    <aside className={`fixed bottom-0 left-0 top-[72px] z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
      <nav className="space-y-1" aria-label="Dashboard navigation">
        {navigation.map((item) => {
          const selected = active === item.id;
          const Icon = item.id === "dashboard" ? CalendarIcon : item.id === "rides" ? CarIcon : item.id === "earnings" ? DollarSignIcon : item.id === "verification" ? ShieldCheckIcon : UsersIcon;
          return <button key={item.id} onClick={() => onSelect(item.id as DriverDashboardSection)} aria-current={selected ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${selected ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={19} />{item.label}</button>;
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><HeadphonesIcon size={19} /></span>
        <p className="mt-3 text-sm font-bold text-slate-900">Need a hand?</p><p className="mt-1 text-xs leading-5 text-slate-500">Our driver support team is here to help.</p>
        <a href="mailto:support@moventra.com" className="mt-3 inline-block text-xs font-bold text-emerald-800 hover:underline">Contact support</a>
      </div>
      <button onClick={onLogout} className="mt-4 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">Log out</button>
    </aside>
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
      {navigation.filter((item) => ["dashboard", "rides", "earnings", "profile"].includes(item.id)).map((item) => <button key={item.id} onClick={() => onSelect(item.id as DriverDashboardSection)} className={`flex flex-col items-center gap-1 py-1.5 text-[10px] font-bold ${active === item.id ? "text-emerald-800" : "text-slate-400"}`}><span>{item.id === "dashboard" ? <CalendarIcon size={19} /> : item.id === "rides" ? <CarIcon size={19} /> : item.id === "earnings" ? <DollarSignIcon size={19} /> : <UsersIcon size={19} />}</span>{item.mobileLabel || item.label}</button>)}
    </nav>
  </>;
}

export function PageHeading({ section, driver }: { section: DriverDashboardSection; driver: DriverProfile }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-emerald-800">{section === "dashboard" ? `${greeting}, ${driver.name.split(" ")[0]}` : "Driver workspace"}</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[28px]">{section === "dashboard" ? "Ready to drive today?" : sectionTitles[section]}</h1><p className="mt-1 text-sm text-slate-500">{section === "dashboard" ? "Here’s an overview of your driver account." : `Manage your ${sectionTitles[section].toLowerCase()} information.`}</p></div><span className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><ClockIcon size={16} />Today</span></div>;
}

export function StatsCard({ label, value, detail, icon, tone = "green" }: { label: string; value: string; detail: string; icon: ReactNode; tone?: "green" | "mint" | "amber" | "navy" }) {
  const tones = { green: "bg-emerald-50 text-emerald-800", mint: "bg-teal-50 text-teal-800", amber: "bg-amber-50 text-amber-800", navy: "bg-slate-100 text-slate-800" };
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span></div><p className="mt-3 text-xs text-slate-500">{detail}</p></article>;
}

export function DriverStatusCard({
  online,
  busy,
  canGoOnline,
  suspended,
  onToggle,
}: {
  online: boolean;
  busy: boolean;
  canGoOnline: boolean;
  suspended: boolean;
  onToggle: () => void;
}) {
  return <section className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${online ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white"}`}><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-start gap-4"><span className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${online ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}><span className={`h-3 w-3 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-extrabold text-slate-950">You’re {online ? "online" : "offline"}</h2><span className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider ${online ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{online ? "Online" : "Offline"}</span></div><p className="mt-1 text-sm text-slate-600">{suspended ? "Your account is suspended. Contact support for help." : canGoOnline ? online ? "You’re available for new ride requests." : "Go online when you’re ready to receive ride requests." : "Complete driver verification before going online."}</p></div></div><button type="button" onClick={onToggle} disabled={busy || (suspended && !online) || (!canGoOnline && !online)} className={`rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${online ? "border border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100" : "bg-emerald-900 text-white hover:bg-emerald-800"}`}>{busy ? "Updating…" : online ? "Go offline" : "Go online"}</button></div></section>;
}

export function VehicleCard({ vehicle, onManage }: { vehicle: DriverVehicle | null; onManage?: () => void }) {
  if (!vehicle) return <EmptyCard title="Vehicle information" message="No vehicle is linked to your account yet." action="Manage vehicle" />;
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle information</p><h2 className="mt-2 text-lg font-extrabold text-slate-950">{vehicle.brand} {vehicle.model}</h2><p className="mt-1 text-sm text-slate-600">{vehicle.vehicleType} <span className="px-1 text-slate-300">·</span> {vehicle.registrationNumber}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><CarIcon size={22} /></span></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4"><Detail label="Color" value={vehicle.color} /><Detail label="Seats" value={`${vehicle.seats}`} /><Detail label="Fuel" value={vehicle.fuelType} /></div><button className="mt-5 text-sm font-bold text-emerald-800 hover:underline" onClick={onManage}>Manage vehicle <span aria-hidden="true">→</span></button></section>;
}

export function VerificationCard({ driver, documents }: { driver: DriverProfile; documents: DriverDocumentSummary[] }) {
  const checks = [
    ["Profile", driver.verification?.profileCompleted ?? false],
    ["Phone", driver.verification?.phoneVerified ?? false],
    ["Driving licence", driver.verification?.licenseVerified ?? false],
    ["Vehicle", driver.verification?.vehicleVerified ?? false],
    ["Documents", driver.verification?.documentsVerified ?? documents.some((document) => document.verificationStatus === "approved")],
  ] as const;
  const status = driver.status === "suspended" ? "Suspended" : (driver.verification?.status || "incomplete").replaceAll("_", " ");
  const needsAttention = ["rejected", "incomplete"].includes(driver.verification?.status || "incomplete");
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification status</p><h2 className="mt-2 text-lg font-extrabold capitalize text-slate-950">{status}</h2></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheckIcon size={22} /></span></div><ul className="mt-4 space-y-3">{checks.map(([label, done]) => <li key={label} className="flex items-center gap-2.5 text-sm"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>{done ? <CheckIcon size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span><span className={done ? "text-slate-700" : "text-slate-500"}>{label}</span><span className="ml-auto text-xs font-medium text-slate-400">{done ? "Complete" : "Pending"}</span></li>)}</ul>{needsAttention && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Your verification needs attention. Review your details or contact driver support.</div>}</section>;
}

export function RecentRides() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-extrabold text-slate-950">Recent rides</h2><p className="mt-1 text-sm text-slate-500">Your latest completed trips</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600"><MapPinIcon size={20} /></span></div><div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-500"><CarIcon size={22} /></span><p className="mt-3 text-sm font-bold text-slate-800">No rides to show yet</p><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Your ride history will appear here once the rides service is connected.</p></div></section>;
}

export function QuickActions({ onSelect }: { onSelect: (section: DriverDashboardSection) => void }) {
  const actions: { label: string; section: DriverDashboardSection; icon: ReactNode }[] = [
    { label: "View rides", section: "rides", icon: <CarIcon size={18} /> },
    { label: "View earnings", section: "earnings", icon: <DollarSignIcon size={18} /> },
    { label: "Manage vehicle", section: "vehicle", icon: <CarIcon size={18} /> },
    { label: "Verification", section: "verification", icon: <ShieldCheckIcon size={18} /> },
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-extrabold text-slate-950">Quick actions</h2><div className="mt-4 grid grid-cols-2 gap-2">{actions.map((action) => <button key={action.section} onClick={() => onSelect(action.section)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-left text-xs font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 sm:text-sm">{action.icon}{action.label}</button>)}</div></section>;
}

export function EmptyCard({ title, message, action }: { title: string; message: string; action?: string }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-extrabold text-slate-950">{title}</h2><div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center"><p className="text-sm font-semibold text-slate-700">Nothing here yet</p><p className="mt-1 text-sm text-slate-500">{message}</p>{action && <button className="mt-4 rounded-lg bg-emerald-900 px-4 py-2 text-sm font-bold text-white">{action}</button>}</div></section>;
}

export function EarningsEmpty() {
  return <EmptyCard title="Earnings" message="Earnings summaries will appear here when ride and payout services are available." />;
}

export function ProfileCard({ driver }: { driver: DriverProfile }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-extrabold text-slate-950">Personal information</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Detail label="Full name" value={driver.name} /><Detail label="Email address" value={driver.email} /><Detail label="Phone number" value={driver.phone} /><Detail label="City" value={driver.address?.city || "Not added"} /><Detail label="State" value={driver.address?.state || "Not added"} /></dl></section>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 truncate text-sm font-semibold text-slate-800">{value || "—"}</dd></div>;
}

export function PlaceholderStats({ completedRides = 0 }: { completedRides?: number }) {
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><StatsCard label="Today's rides" value="0" detail="No rides completed today" icon={<CarIcon size={20} />} /><StatsCard label="Today's earnings" value="₹0" detail="No earnings recorded today" icon={<DollarSignIcon size={20} />} tone="mint" /><StatsCard label="Driver rating" value="—" detail="Rating appears after your first ride" icon={<StarIcon size={20} />} tone="amber" /><StatsCard label="Completed rides" value={`${completedRides}`} detail="All time" icon={<UsersIcon size={20} />} tone="navy" /></div>;
}
