"use client";

import React, { useState } from "react";
import {
  CarIcon,
  TrendingUpIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
  DollarSignIcon,
  ShieldCheckIcon,
} from "@/icons/page";

export default function DriverCTA() {
  const [driverEmail, setDriverEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverEmail.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="drive" className="py-20 lg:py-28 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Radiant Glows */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#0F2344] via-[#0A192F] to-[#07101E] border border-slate-700/60 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Driver Pitch & Sign-up */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <TrendingUpIcon size={14} />
                <span>Driver Partner Program</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
                Earn on your own schedule —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white">
                  Drive with Moventra.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                Keep up to 88% of passenger fares. Enjoy instant daily cashouts, comprehensive commercial insurance coverage, and peak-hour guaranteed bonus incentives.
              </p>

              {/* Driver Benefits Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07101E] text-blue-400 flex items-center justify-center border border-slate-700">
                    <DollarSignIcon size={16} />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">Keep up to 88% of ride fare</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07101E] text-blue-400 flex items-center justify-center border border-slate-700">
                    <ClockIcon size={16} />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">100% flexible working hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07101E] text-blue-400 flex items-center justify-center border border-slate-700">
                    <TrendingUpIcon size={16} />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">Daily instant automated cashout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07101E] text-blue-400 flex items-center justify-center border border-slate-700">
                    <ShieldCheckIcon size={16} />
                  </div>
                  <span className="text-sm text-slate-200 font-medium">$1M third-party liability policy</span>
                </div>
              </div>

              {/* Instant Application Form */}
              {submitted ? (
                <div className="p-4 rounded-2xl bg-[#0F2344] border border-blue-400 text-slate-200 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-600 text-white">
                    <CheckIcon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Application link dispatched!</h4>
                    <p className="text-xs text-slate-300">Check your inbox for step-by-step onboarding instructions.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <input
                    type="email"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    placeholder="Enter your email to apply..."
                    className="flex-1 px-4 py-3.5 rounded-xl bg-[#07101E] border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Become a Driver</span>
                    <ArrowRightIcon size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Driver Earnings Preview Illustration */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#07101E] border border-slate-700 p-6 sm:p-7 shadow-xl">
                {/* Header of Driver Earnings Card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                      DP
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">David Peterson</div>
                      <div className="text-xs text-blue-400 flex items-center gap-1 font-medium">
                        <CheckIcon size={12} /> Top Moventra Partner (2 yrs)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 font-bold">
                    Active Online
                  </span>
                </div>

                {/* Earnings Metric */}
                <div className="my-6 p-4 rounded-xl bg-[#0F2344] border border-slate-700/80">
                  <div className="text-xs text-slate-400 font-medium">This Week’s Earnings</div>
                  <div className="text-3xl font-black text-white mt-1 flex items-baseline gap-1">
                    $1,842<span className="text-lg text-blue-400">.50</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-semibold">
                    <TrendingUpIcon size={14} />
                    <span>+18.4% compared to standard ride-hail platforms</span>
                  </div>
                </div>

                {/* Weekly summary row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-[#0F2344]/50 border border-slate-800">
                    <div className="text-xs text-slate-400">Completed</div>
                    <div className="text-base font-bold text-white mt-0.5">58 rides</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F2344]/50 border border-slate-800">
                    <div className="text-xs text-slate-400">Online Time</div>
                    <div className="text-base font-bold text-white mt-0.5">31.5 hrs</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0F2344]/50 border border-slate-800">
                    <div className="text-xs text-slate-400">Rider Tips</div>
                    <div className="text-base font-bold text-blue-400 mt-0.5">$312.00</div>
                  </div>
                </div>

                {/* Driver Quote */}
                <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                  “Switching to Moventra gave me transparent take-home pay and respectful passengers. Best decision I made for my career.”
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
