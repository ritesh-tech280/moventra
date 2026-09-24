"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardHeader,
  DriverStatusCard,
  EarningsEmpty,
  EmptyCard,
  PageHeading,
  PlaceholderStats,
  ProfileCard,
  QuickActions,
  RecentRides,
  Sidebar,
  VehicleCard,
  VerificationCard,
} from "@/components/driver/DashboardParts";
import { getDriverDashboard, DRIVER_TOKEN_KEY, DriverApiError, updateDriverAvailability } from "@/lib/driverApi";
import type { DriverDashboardData, DriverDashboardSection } from "@/types/driver";

export default function DriverDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<DriverDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<DriverDashboardSection>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);

  const loadDashboard = useCallback(async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      setDashboard(await getDriverDashboard(authToken));
    } catch (issue) {
      if (issue instanceof DriverApiError && issue.status === 401) {
        window.localStorage.removeItem(DRIVER_TOKEN_KEY);
        router.replace("/driver/login");
        return;
      }
      setError(issue instanceof Error ? issue.message : "Unable to load the driver dashboard.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(DRIVER_TOKEN_KEY);
    if (!storedToken) {
      router.replace("/driver/login");
      return;
    }
    setToken(storedToken);
    void loadDashboard(storedToken);
  }, [loadDashboard, router]);

  const navigate = (section: DriverDashboardSection) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  const logout = () => {
    window.localStorage.removeItem(DRIVER_TOKEN_KEY);
    router.replace("/driver/login");
  };

  const toggleAvailability = async () => {
    if (!dashboard || !token) return;
    const online = dashboard.driver.availability !== "online";
    setAvailabilityBusy(true);
    setError("");
    try {
      const result = await updateDriverAvailability(token, online);
      if (!result.availability) throw new Error(result.message || "Unable to update your availability.");
      setDashboard((current) => current ? {
        ...current,
        driver: { ...current.driver, availability: result.availability },
      } : current);
    } catch (issue) {
      if (issue instanceof DriverApiError && issue.status === 401) {
        window.localStorage.removeItem(DRIVER_TOKEN_KEY);
        router.replace("/driver/login");
      } else {
        setError(issue instanceof Error ? issue.message : "Unable to update availability.");
      }
    } finally {
      setAvailabilityBusy(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-slate-50 p-5 sm:p-10"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-8 w-52 rounded-lg bg-slate-200" /><div className="mt-8 h-36 rounded-2xl bg-white shadow-sm" /><div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl bg-white shadow-sm" />)}</div><div className="mt-5 h-64 rounded-2xl bg-white shadow-sm" /></div></main>;
  }
  if (!dashboard) return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"><h1 className="text-lg font-extrabold text-slate-950">Dashboard unavailable</h1><p role="alert" className="mt-2 text-sm text-slate-600">{error || "We couldn't load your driver account."}</p><div className="mt-5 flex justify-center gap-3"><button onClick={() => token ? void loadDashboard(token) : router.replace("/driver/login")} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white">Try again</button><button onClick={logout} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Sign out</button></div></section></main>;

  const online = dashboard.driver.availability === "online";
  const approved = dashboard.driver.status === "active" && dashboard.driver.verification?.status === "approved";
  const suspended = dashboard.driver.status === "suspended" || dashboard.driver.verification?.status === "suspended";
  const canGoOnline = approved && !suspended;

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <DashboardHeader driver={dashboard.driver} onMenu={() => setMenuOpen((open) => !open)} onLogout={logout} />
    <Sidebar active={activeSection} open={menuOpen} onSelect={navigate} onLogout={logout} />
    <main className="min-h-[calc(100vh-72px)] px-4 pb-24 pt-7 sm:px-8 lg:ml-[260px] lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeading section={activeSection} driver={dashboard.driver} />
        {error && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><span>{error}</span><button onClick={() => void loadDashboard(token)} className="font-bold underline">Try again</button></div>}
        {!approved && !suspended && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4"><div><p className="text-sm font-bold text-amber-950">Finish verification to start driving</p><p className="mt-1 text-sm text-amber-900">Your dashboard is ready. Ride availability will unlock when your profile is approved.</p></div><button onClick={() => navigate("verification")} className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-100">View verification</button></div>}
        {suspended && <div role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4"><p className="text-sm font-bold text-rose-950">Your driver account is suspended</p><p className="mt-1 text-sm text-rose-800">You cannot go online or accept rides while your account is suspended. Please contact driver support.</p></div>}

        {activeSection === "dashboard" && <div className="space-y-5"><DriverStatusCard online={online} busy={availabilityBusy} canGoOnline={canGoOnline} suspended={suspended} onToggle={() => void toggleAvailability()} /><PlaceholderStats /><div className="grid gap-5 xl:grid-cols-[1.25fr_0.85fr]"><div className="space-y-5"><VehicleCard vehicle={dashboard.vehicle} onManage={() => navigate("vehicle")} /><RecentRides /></div><div className="space-y-5"><VerificationCard driver={dashboard.driver} documents={dashboard.documents} /><QuickActions onSelect={navigate} /></div></div></div>}
        {activeSection === "profile" && <ProfileCard driver={dashboard.driver} />}
        {activeSection === "vehicle" && <VehicleCard vehicle={dashboard.vehicle} />}
        {activeSection === "verification" && <VerificationCard driver={dashboard.driver} documents={dashboard.documents} />}
        {activeSection === "rides" && <EmptyCard title="Ride history" message="Your completed rides will appear here when ride history is available." />}
        {activeSection === "earnings" && <EarningsEmpty />}
        {activeSection === "settings" && <EmptyCard title="Settings" message="Account settings will be available here." />}
        <footer className="mt-8 hidden items-center justify-between border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex"><span>Moventra Driver Partner</span><span>Need help? <a className="font-semibold text-emerald-800 hover:underline" href="mailto:support@moventra.com">Contact support</a></span></footer>
      </div>
    </main>
  </div>;
}
