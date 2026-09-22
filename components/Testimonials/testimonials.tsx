"use client";

import React from "react";
import { StarIcon, QuoteIcon, CheckIcon } from "@/icons/page";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatarText: string;
  rating: number;
  quote: string;
  rideType: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "VP of Product, FinTech",
    location: "New York, NY",
    avatarText: "ER",
    rating: 5,
    quote:
      "Moventra completely eliminated airport departure anxiety. The scheduled Comfort Sedan was waiting outside my building 5 minutes early, impeccably clean, and the price never spiked despite heavy morning traffic.",
    rideType: "Comfort Sedan",
  },
  {
    id: 2,
    name: "Dr. Julian Mercer",
    role: "Clinical Director",
    location: "Chicago, IL",
    avatarText: "JM",
    rating: 5,
    quote:
      "The zero-emission Eco Mini fleet is a breath of fresh air. It’s quiet, fast to dispatch in the Loop, and you can tell their drivers actually take pride in hospitality and safe driving.",
    rideType: "Eco Mini",
  },
  {
    id: 3,
    name: "Sarah Chen-Kim",
    role: "Architectural Designer",
    location: "San Francisco, CA",
    avatarText: "SC",
    rating: 5,
    quote:
      "Knowing the guaranteed fare upfront before stepping in is why I uninstalled the other ride apps. Clean interiors, great climate control, and lightning-fast customer support whenever I had questions.",
    rideType: "Executive SUV",
  },
  {
    id: 4,
    name: "Marcus Thorne",
    role: "Event Producer",
    location: "Austin, TX",
    avatarText: "MT",
    rating: 5,
    quote:
      "We booked three Executive SUVs for our festival VIP guests. Flawless synchronization, courteous drivers in uniform, and effortless digital invoicing. Moventra is now our exclusive corporate partner.",
    rideType: "Executive SUV",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <span>Rider Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Loved by 500,000+ City Travelers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Read authentic feedback from daily commuters, business travelers, and families who rely on Moventra every day.
          </p>
        </div>

        {/* Responsive Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Star Rating & Quote Mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-blue-200">
                    <QuoteIcon size={24} />
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  “{item.quote}”
                </p>
              </div>

              {/* Author & Verification Info */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0A192F] to-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {item.avatarText}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1 truncate">
                    {item.name}
                    <span className="text-blue-600" title="Verified Rider">
                      <CheckIcon size={14} />
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {item.role} • {item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Trust Callout */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-blue-200 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <StarIcon size={24} className="fill-white" />
            </div>
            <div>
              <div className="text-base font-bold text-[#0F172A]">
                4.8 out of 5 stars across 120,000+ app ratings
              </div>
              <p className="text-xs text-slate-600">
                Ranked #1 for reliability and driver courtesy in metropolitan transit reviews.
              </p>
            </div>
          </div>
          <a
            href="#book"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow hover:scale-105 transition-all shrink-0"
          >
            Join Satisfied Riders
          </a>
        </div>

      </div>
    </section>
  );
}
