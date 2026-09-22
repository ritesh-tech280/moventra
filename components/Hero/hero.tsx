"use client";

import React from "react";
import Link from "next/link";
import FareEstimator from "@/components/FareEstimator/fareEstimator";
import {
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  NavigationIcon,
  CarIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/icons/page";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 overflow-hidden text-slate-900 border-b border-slate-200/60">
      {/* Background Decorative Grids and Subtle Luminous Blue Glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Value Proposition & Fare Estimator */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold w-fit mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Next-Gen Urban Taxi</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">Available 24/7</span>
            </div>

            {/* Large Headline (Dark Navy with Confident Blue accent) */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.1] mb-5">
              Your ride,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                on your schedule.
              </span>
            </h1>

            {/* Subheadline (Neutral Gray) */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
              Reliable point-to-point taxi booking with guaranteed flat fares, verified courteous drivers, and comfortable modern fleet options in over 50 cities.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-700 mb-8">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckIcon size={16} className="text-blue-600" />
                Guaranteed Flat Rates
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckIcon size={16} className="text-blue-600" />
                3-Minute Average Pickup
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckIcon size={16} className="text-blue-600" />
                No Surge Pricing
              </span>
            </div>

            {/* Booking & Fare-Estimate Widget */}
            <FareEstimator />
          </div>

          {/* Right Column: Hero Visual Graphic / Clean Map & Vehicle Card */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent blur-xl opacity-75" />

              <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl overflow-hidden">
                {/* Visual Top Header of the mock dispatch display */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Live Dispatch Radar
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">GPS Signal: 100% Locked</span>
                </div>

                {/* Simulated Clean Route Map graphic */}
                <div className="relative my-6 h-56 sm:h-64 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {/* Subtle Grid */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Route Paths */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240" fill="none">
                    <path
                      d="M 60 180 Q 140 180 180 120 T 330 60"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      className="animate-[dash_20s_linear_infinite]"
                    />
                    {/* Pickup Marker */}
                    <circle cx="60" cy="180" r="8" fill="#3B82F6" fillOpacity="0.25" />
                    <circle cx="60" cy="180" r="4" fill="#2563EB" />

                    {/* Animated Car Marker */}
                    <circle cx="180" cy="120" r="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />

                    {/* Destination Pin */}
                    <circle cx="330" cy="60" r="10" fill="#2563EB" fillOpacity="0.25" />
                    <circle cx="330" cy="60" r="5" fill="#1D4ED8" />
                  </svg>

                  {/* Active Driver Matching Overlay Card */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 border border-slate-200 p-3 flex items-center justify-between backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                        <CarIcon size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                          Marcus Vance
                          <span className="inline-flex items-center text-[10px] text-amber-500 font-bold">
                            <StarIcon size={10} className="fill-amber-400 mr-0.5" /> 4.95
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Toyota Camry Hybrid • Plate #MV-882</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-bold">
                        2 mins away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Fleet Statistics Bar */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-bold text-[#0F172A]">48</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Cabs Nearby</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-bold text-blue-600">2.8 min</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Median Arrival</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-bold text-emerald-600">99.4%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">On-Time Rate</div>
                  </div>
                </div>

                {/* Safety Seal Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheckIcon size={15} className="text-blue-600" />
                    Biometrically verified drivers & inspected vehicles
                  </span>
                  <Link
                    href="#why-us"
                    className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    Details <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Indicators Below the Fold of Hero */}
        <div className="mt-16 lg:mt-24 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight flex items-baseline gap-1">
                500K<span className="text-blue-600">+</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Rides Completed Safely
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight flex items-baseline gap-1">
                50<span className="text-blue-600">+</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Cities Across North America & Europe
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
                4.8
                <StarIcon size={22} className="text-amber-400 fill-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Average Rider Rating (120k+ reviews)
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight flex items-baseline gap-1">
                99.4<span className="text-blue-600">%</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                On-Time Driver Arrival Rate
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
