"use client";

import React from "react";
import Link from "next/link";
import {
  CarIcon,
  AppleIcon,
  GooglePlayIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@/icons/page";

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-white text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-[#1E3A8A] border border-blue-500 p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Subtle Accent Glow Ring */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
            <SparklesIcon size={14} />
            <span>Elevate Your Commute</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            Ready to ride with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-blue-100">
              guaranteed comfort?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Join more than 500,000 satisfied passengers who trust Moventra for on-time departures, transparent fares, and courteous drivers.
          </p>

          {/* Action Buttons & App Store Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="#book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-slate-50 font-black text-base shadow-xl hover:scale-105 active:scale-[0.98] transition-all"
            >
              <CarIcon size={20} />
              <span>Book Your First Ride</span>
              <ArrowRightIcon size={18} />
            </Link>

            {/* Apple App Store Button */}
            <a
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                alert("Moventra iOS app will be available on the App Store soon!");
              }}
              className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3.5 rounded-xl bg-blue-800/80 border border-blue-400/40 hover:bg-blue-800 text-white transition-all text-left group"
            >
              <AppleIcon size={26} className="text-white group-hover:text-sky-200 transition-colors" />
              <div>
                <div className="text-[10px] text-blue-200 leading-none">Download on the</div>
                <div className="text-sm font-bold leading-tight">App Store</div>
              </div>
            </a>

            {/* Google Play Store Button */}
            <a
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                alert("Moventra Android app will be available on Google Play soon!");
              }}
              className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3.5 rounded-xl bg-blue-800/80 border border-blue-400/40 hover:bg-blue-800 text-white transition-all text-left group"
            >
              <GooglePlayIcon size={24} className="text-white group-hover:text-sky-200 transition-colors" />
              <div>
                <div className="text-[10px] text-blue-200 leading-none">Get it on</div>
                <div className="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </a>
          </div>

          {/* Bottom Reassurance Tag */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/90 pt-6 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon size={15} className="text-sky-300" />
              No credit card required for web quotes
            </span>
            <span className="text-white/40">•</span>
            <span>Free cancellation within 5 minutes</span>
            <span className="text-white/40">•</span>
            <span>24/7 Roadside & Passenger Support</span>
          </div>

        </div>
      </div>
    </section>
  );
}
