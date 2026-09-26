"use client";

import React, { useState } from "react";
import {
  MapPinIcon,
  NavigationIcon,
  CarIcon,
  SuvIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/icons/page";

export type RideTier = "ertiga" | "comfort" | "suv";

export interface FareEstimateResult {
  fare: number;
  distanceKm: number;
  tier: RideTier;
  tierName: string;
  surgeMultiplier?: number;
}

export interface FareEstimatorProps {
  onEstimateCalculated?: (result: FareEstimateResult) => void;
  className?: string;
}

const rideTiers = [
  {
    id: "ertiga" as RideTier,
    name: "Ertiga",
    perKm: 15,
    icon: CarIcon,
  },
  {
    id: "comfort" as RideTier,
    name: "Sedan",
    perKm: 13,
    icon: CarIcon,
  },
  {
    id: "suv" as RideTier,
    name: "SUV",
    perKm: 18,
    icon: SuvIcon,
  },
];

const popularLocations = [
  { pickup: "Indira Gandhi International Airport", dropoff: "Agra Taj Mahal", distanceKm: 216.1 },
  { pickup: "Delhi", dropoff: "Rishikesh", distanceKm: 235 },
  { pickup: "Bareilly", dropoff: "New Delhi", distanceKm: 270.6 },
  { pickup: "Bareilly", dropoff: "Nainital", distanceKm: 138 },
];

export default function FareEstimator({ onEstimateCalculated, className = "" }: FareEstimatorProps) {
  const [pickup, setPickup] = useState(popularLocations[0].pickup);
  const [dropoff, setDropoff] = useState(popularLocations[0].dropoff);
  const [selectedTier, setSelectedTier] = useState<RideTier>("comfort");
  const [estimate, setEstimate] = useState<FareEstimateResult | null>({
    fare: 216.1 * 13,
    distanceKm: 216.1,
    tier: "comfort",
    tierName: "Sedan",
  });

  const handleCalculateFare = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) return;

    const route = popularLocations.find((loc) =>
      loc.pickup.toLowerCase() === pickup.trim().toLowerCase() &&
      loc.dropoff.toLowerCase() === dropoff.trim().toLowerCase()
    );
    if (!route) {
      setEstimate(null);
      return;
    }
    const tierConfig = rideTiers.find((t) => t.id === selectedTier) || rideTiers[1];
    const result: FareEstimateResult = {
      fare: Math.round(route.distanceKm * tierConfig.perKm * 100) / 100,
      distanceKm: route.distanceKm,
      tier: selectedTier,
      tierName: tierConfig.name,
    };
    setEstimate(result);
    onEstimateCalculated?.(result);
  };

  const handleSelectQuickTrip = (presetPickup: string, presetDropoff: string) => {
    setPickup(presetPickup);
    setDropoff(presetDropoff);
    setEstimate(null);
  };

  return (
    <div
      id="book"
      className={`rounded-2xl bg-white border border-slate-200 p-6 lg:p-7 shadow-xl transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <NavigationIcon size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Fare Estimator</h2>
            <p className="text-xs text-slate-500">Prices per kilometre</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
          Popular routes
        </span>
      </div>

      <form onSubmit={handleCalculateFare} className="space-y-4">
        {/* Pickup Input */}
        <div className="relative">
          <label htmlFor="pickup-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Pickup Location
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-blue-600">
              <MapPinIcon size={18} />
            </span>
            <input
              id="pickup-input"
              type="text"
              value={pickup}
              onChange={(e) => { setPickup(e.target.value); setEstimate(null); }}
              placeholder="Enter pickup address, hotel, or station..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Dropoff Input */}
        <div className="relative">
          <label htmlFor="dropoff-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Drop-off Destination
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-blue-600">
              <NavigationIcon size={18} />
            </span>
            <input
              id="dropoff-input"
              type="text"
              value={dropoff}
              onChange={(e) => { setDropoff(e.target.value); setEstimate(null); }}
              placeholder="Enter destination address or airport code..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Popular Quick-Select presets for instant UX */}
        <div className="pt-1">
          <p className="text-[11px] text-slate-500 font-medium mb-1.5">Popular Routes:</p>
          <div className="flex flex-wrap gap-1.5">
            {popularLocations.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickTrip(loc.pickup, loc.dropoff)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors font-medium"
              >
                {loc.pickup.split(",")[0].slice(0, 18)} → {loc.dropoff.split("(")[0].slice(0, 14)}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Category Picker */}
        <div className="pt-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Ride Class
          </label>
          <div className="grid grid-cols-3 gap-2">
            {rideTiers.map((tier) => {
              const IconComp = tier.icon;
              const isSelected = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => { setSelectedTier(tier.id); setEstimate(null); }}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-600 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <IconComp
                      size={18}
                      className={isSelected ? "text-blue-600" : "text-slate-500"}
                    />
                    {isSelected && (
                      <span className="text-blue-600">
                        <CheckIcon size={14} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${isSelected ? "text-blue-950" : "text-slate-800"}`}>
                      {tier.name}
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                      ₹{tier.perKm}/km
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Get Fare Estimate Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <span>Calculate fare</span>
          <ArrowRightIcon size={16} />
        </button>
      </form>

      {!estimate && <p className="mt-3 text-xs text-slate-500">Select a popular route to see its distance and fare.</p>}
      {estimate && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 relative overflow-hidden">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600">
                  Fare estimate
                </span>
                <p className="text-xs text-slate-600 font-medium">{estimate.tierName}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#0F172A] tracking-tight flex items-baseline justify-end gap-0.5">
                  <span className="text-sm font-bold text-blue-600">₹</span>
                  <span>{estimate.fare.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <span className="text-[10px] text-slate-500">{rideTiers.find((tier) => tier.id === estimate.tier)?.perKm} per km</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-blue-600 border border-slate-200">
                  <NavigationIcon size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">{estimate.distanceKm} km</div>
                  <div className="text-[10px] text-slate-500">Distance</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
