"use client";

import React from "react";
import {
  NavigationIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  HeadphonesIcon,
  CreditCardIcon,
  CalendarIcon,
  SparklesIcon,
} from "@/icons/page";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tag: string;
}

const features: Feature[] = [
  {
    title: "Live GPS Tracking",
    description: "Monitor your driver's real-time trajectory on precision telemetry maps and share ride tracking with family with one tap.",
    icon: NavigationIcon,
    tag: "Sub-second GPS",
  },
  {
    title: "Verified Professional Drivers",
    description: "Every driver completes mandatory in-person background checks, vehicle safety audits, and hospitality customer care training.",
    icon: ShieldCheckIcon,
    tag: "Top 5% accepted",
  },
  {
    title: "Transparent Upfront Pricing",
    description: "Zero surprise surge rates or hidden destination surcharges. What you see on the fare estimator is precisely what you pay.",
    icon: DollarSignIcon,
    tag: "Guaranteed rate",
  },
  {
    title: "24/7 Dedicated Support",
    description: "Human dispatchers and rider care specialists ready round-the-clock via instant in-app live chat and prioritized hotline.",
    icon: HeadphonesIcon,
    tag: "< 45s response",
  },
  {
    title: "Multiple Payment Options",
    description: "Seamlessly checkout with Apple Pay, Google Pay, corporate expense cards, major credit cards, or Moventra credits.",
    icon: CreditCardIcon,
    tag: "Cashless & flexible",
  },
  {
    title: "Ride Scheduling in Advance",
    description: "Lock in critical airport departures or early dawn journeys up to 30 days ahead with our 100% guaranteed driver arrival pledge.",
    icon: CalendarIcon,
    tag: "Up to 30 days",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-slate-50 text-slate-900 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <SparklesIcon size={14} className="text-blue-600" />
            <span>The Moventra Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Why Discerning Riders Choose Us
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We redesigned urban transit from the ground up prioritizing punctuality, passenger peace of mind, and transparent pricing.
          </p>
        </div>

        {/* 6 Features Responsive Grid: 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-white p-7 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white border border-blue-100 flex items-center justify-center transition-all duration-300 shadow-sm">
                      <IconComp size={24} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>Standard on every ride</span>
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
