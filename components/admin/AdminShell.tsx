"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CarFront,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { adminApi, adminToken } from "@/lib/admin-api";

const links = [
  ["Dashboard", "/admin/dashboard", LayoutDashboard],
  ["Drivers", "/admin/drivers", Users],
  ["Vehicles", "/admin/vehicles", CarFront],
  ["Riders", "/admin/riders", Users],
  ["Rides", "/admin/rides", Activity],
  ["Documents", "/admin/documents", ShieldCheck],
  ["Notifications", "/admin/notifications", Bell],
  ["Settings", "/admin/settings", Settings],
] as const;
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(
    null,
  );
  const login = path === "/admin/login";
  useEffect(() => {
    if (login) return;
    if (!adminToken()) {
      router.replace("/admin/login");
      return;
    }
    adminApi<{ admin: { name: string; email: string } }>("/me")
      .then((data) => setAdmin(data.admin))
      .catch(() => router.replace("/admin/login"));
  }, [login, router]);
  async function logout() {
    try {
      await adminApi("/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("moventra-admin-token");
      router.replace("/admin/login");
    }
  }
  if (login) return <>{children}</>;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight text-slate-900"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-700 text-white">
              <CarFront size={20} />
            </span>
            Moventra
            <span className="hidden font-medium text-slate-400 sm:inline">
              / Admin
            </span>
          </Link>
        </div>
        <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 md:flex">
          <Search size={16} />
        <input type="text" placeholder="Search drivers, rides, vehicles" className="w-full outline-none"/>  
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold text-slate-800">
              {admin?.name || "Administrator"}
            </div>
            <div className="text-xs text-slate-500">Fleet operations</div>
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {admin?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <button
            onClick={logout}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 sm:flex"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex">
          <div className="px-3 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Operations
          </div>
          <nav className="space-y-1">
            {links.map(([label, href, Icon]) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${path.startsWith(href) ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-100 pt-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
              Back to website
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      {menu && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden"
          onClick={() => setMenu(false)}
        >
          <aside
            className="h-full w-[min(300px,85vw)] bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between font-bold">
              <span>Moventra Admin</span>
              <button onClick={() => setMenu(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            {links.map(([label, href, Icon]) => (
              <Link
                onClick={() => setMenu(false)}
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-emerald-50"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-3 px-3 py-3 text-sm text-red-600"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
