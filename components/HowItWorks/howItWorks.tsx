"use client";

import React from "react";
import {
  MapPinIcon,
  CarIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from "@/icons/page";

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tag: string;
}

const steps: StepItem[] = [
  {
    step: "01",
    title: "Enter your destination",
    description: "Add your pickup and destination to see the route distance and available fare estimate.",
    icon: MapPinIcon,
    tag: "Enter route",
  },
  {
    step: "02",
    title: "Choose a vehicle",
    description: "Compare the vehicle options and select one that suits your passengers and luggage.",
    icon: CarIcon,
    tag: "Your choice",
  },
  {
    step: "03",
    title: "Review and confirm",
    description: "Check your trip details and fare with the booking information before you confirm.",
    icon: CreditCardIcon,
    tag: "Trip details",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 text-slate-900 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <span>Seamless Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            How Moventra Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Plan your ride in three simple steps.
          </p>
        </div>

        {/* 3 Steps Container */}
        <div className="relative">
          {/* Subtle desktop connector line */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative flex flex-col items-center sm:items-start text-center sm:text-left bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Top Step Badge & Tag */}
                  <div className="w-full flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 group-hover:text-blue-600 transition-colors font-mono">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <IconComp size={28} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Mobile step flow arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-6 text-blue-600 flex justify-center w-full">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <ArrowRightIcon size={16} className="rotate-90 sm:rotate-0" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA sub-strip */}
        <div className="mt-14 text-center">
          <a
            href="#book"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 group transition-colors"
          >
            <span>Ready to experience effortless transportation?</span>
            <span className="inline-flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
              Book a ride now <ArrowRightIcon size={16} className="ml-1" />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
