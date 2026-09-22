"use client";

import React, { useState } from "react";
import {
  CarIcon,
  SuvIcon,
  LeafIcon,
  UsersIcon,
  LuggageIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/icons/page";

interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  startingPrice: number;
  capacity: number;
  luggage: number;
  ecoRating: string;
  popular?: boolean;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const categories: VehicleCategory[] = [
  {
    id: "mini",
    name: "Moventra Eco Mini",
    subtitle: "Affordable & 100% Electric",
    startingPrice: 12.0,
    capacity: 3,
    luggage: 2,
    ecoRating: "Zero Tailpipe Emissions",
    description: "Compact, eco-conscious electric hatchbacks engineered for swift city commutes through dense urban traffic.",
    highlights: [
      "Nissan Leaf / Chevy Bolt EV",
      "Instant urban dispatch",
      "Carbon neutral ride credit",
      "Ideal for solo or couple commutes",
    ],
    icon: LeafIcon,
  },
  {
    id: "sedan",
    name: "Moventra Comfort Sedan",
    subtitle: "Spacious & Premium Hybrid",
    startingPrice: 16.5,
    capacity: 4,
    luggage: 3,
    ecoRating: "Ultra-Low Emission Hybrid",
    popular: true,
    description: "Our top-rated choice for daily business travel, airport runs, and evening dinner engagements in total comfort.",
    highlights: [
      "Toyota Camry / Hyundai Sonata Hybrid",
      "Extra legroom & climate control",
      "Phone chargers & complimentary bottled water",
      "Top-tier 4.9★ rated drivers",
    ],
    icon: CarIcon,
  },
  {
    id: "suv",
    name: "Moventra Executive SUV",
    subtitle: "High-Capacity Luxury",
    startingPrice: 25.0,
    capacity: 6,
    luggage: 5,
    ecoRating: "High-Efficiency Hybrid SUV",
    description: "Expansive luxury seating and cavernous cargo room designed for group trips, family travel, and heavy luggage.",
    highlights: [
      "Toyota Highlander / Lincoln Aviator",
      "Full leather executive interior",
      "Ample space for 5 full-size suitcases",
      "Priority airport pickup lane access",
    ],
    icon: SuvIcon,
  },
];

export default function RideOptions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("sedan");

  return (
    <section id="ride-options" className="py-20 lg:py-28 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <SparklesIcon size={14} />
            <span>Modern Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Tailored Vehicles for Every Occasion
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you need a quick hop downtown or an executive airport shuttle for the entire team, we have the ideal clean vehicle ready.
          </p>
        </div>

        {/* Categories Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 border ${
                  cat.popular
                    ? "bg-white border-blue-600 shadow-xl ring-2 ring-blue-600/15 -translate-y-2"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {/* Popular Pill */}
                {cat.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Category Vehicle Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                      <IconComp size={28} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {cat.ecoRating}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-black text-[#0F172A] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold mb-4">
                    {cat.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Capacity Specs */}
                  <div className="flex items-center gap-5 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon size={16} className="text-blue-600" />
                      <span>Up to {cat.capacity} seats</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                      <LuggageIcon size={16} className="text-blue-600" />
                      <span>{cat.luggage} Luggage bags</span>
                    </div>
                  </div>

                  {/* Highlights Bullet points */}
                  <ul className="space-y-2.5 mb-8">
                    {cat.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <CheckIcon size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Action Area */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-slate-500 font-medium">Starting rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-blue-600">from</span>
                      <span className="text-3xl font-black text-[#0F172A]">
                        ${cat.startingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <a
                    href="#book"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      cat.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:scale-[1.02]"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>Select {cat.name.split(" ")[1] || "Vehicle"}</span>
                    <ArrowRightIcon size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
