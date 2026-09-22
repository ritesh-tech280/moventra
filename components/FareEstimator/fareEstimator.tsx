"use client";

import React, { useState } from "react";
import {
  MapPinIcon,
  NavigationIcon,
  CarIcon,
  SuvIcon,
  LeafIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/icons/page";

export type RideTier = "eco" | "comfort" | "suv";

export interface FareEstimateResult {
  fare: number;
  distanceMiles: number;
  durationMins: number;
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
    id: "eco" as RideTier,
    name: "Eco Mini",
    base: 12,
    perMile: 1.65,
    icon: LeafIcon,
    tag: "Lowest Emissions",
  },
  {
    id: "comfort" as RideTier,
    name: "Comfort Sedan",
    base: 16,
    perMile: 2.15,
    icon: CarIcon,
    tag: "Most Popular",
  },
  {
    id: "suv" as RideTier,
    name: "Executive SUV",
    base: 24,
    perMile: 3.1,
    icon: SuvIcon,
    tag: "Up to 6 seats",
  },
];

const popularLocations = [
  { pickup: "Downtown Metropolitan Station", dropoff: "International Airport (Terminal 2)" },
  { pickup: "Financial District, 5th Ave", dropoff: "Tech Innovation Hub" },
  { pickup: "Central Plaza West", dropoff: "Grand Performing Arts Center" },
];

export default function FareEstimator({ onEstimateCalculated, className = "" }: FareEstimatorProps) {
  const [pickup, setPickup] = useState("Downtown Metropolitan Station");
  const [dropoff, setDropoff] = useState("International Airport (Terminal 2)");
  const [selectedTier, setSelectedTier] = useState<RideTier>("comfort");
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<FareEstimateResult | null>({
    fare: 29.5,
    distanceMiles: 13.8,
    durationMins: 22,
    tier: "comfort",
    tierName: "Comfort Sedan",
  });

  const handleCalculateFare = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const tierConfig = rideTiers.find((t) => t.id === selectedTier) || rideTiers[1];
      const seedDistance = 8.5 + ((pickup.length + dropoff.length) % 18) * 0.9;
      const roundedDistance = Math.round(seedDistance * 10) / 10;
      const duration = Math.round(roundedDistance * 1.6 + 6);
      const calculatedFare = Math.round((tierConfig.base + roundedDistance * tierConfig.perMile) * 100) / 100;

      const result: FareEstimateResult = {
        fare: calculatedFare,
        distanceMiles: roundedDistance,
        durationMins: duration,
        tier: selectedTier,
        tierName: tierConfig.name,
      };

      setEstimate(result);
      setIsCalculating(false);
      if (onEstimateCalculated) {
        onEstimateCalculated(result);
      }
    }, 450);
  };

  const handleSelectQuickTrip = (presetPickup: string, presetDropoff: string) => {
    setPickup(presetPickup);
    setDropoff(presetDropoff);
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
            <p className="text-xs text-slate-500">Upfront guaranteed pricing with zero surge surprises</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
          <SparklesIcon size={12} />
          Instant Quote
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
              onChange={(e) => setPickup(e.target.value)}
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
              onChange={(e) => setDropoff(e.target.value)}
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
                  onClick={() => setSelectedTier(tier.id)}
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
                      From ${tier.base}
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
          disabled={isCalculating}
          className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating route...
            </span>
          ) : (
            <>
              <span>Get Fare Estimate</span>
              <ArrowRightIcon size={16} />
            </>
          )}
        </button>
      </form>

      {/* Placeholder Result Area structured for real API payload */}
      {estimate && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 relative overflow-hidden">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600">
                  Guaranteed Estimate
                </span>
                <p className="text-xs text-slate-600 font-medium">{estimate.tierName}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#0F172A] tracking-tight flex items-baseline justify-end gap-0.5">
                  <span className="text-sm font-bold text-blue-600">$</span>
                  <span>{estimate.fare.toFixed(2)}</span>
                </div>
                <span className="text-[10px] text-slate-500">all taxes included</span>
              </div>
            </div>

            {/* Metrics Row: Distance, ETA */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-blue-600 border border-slate-200">
                  <ClockIcon size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">~{estimate.durationMins} mins</div>
                  <div className="text-[10px] text-slate-500">Est. Travel Time</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-blue-600 border border-slate-200">
                  <NavigationIcon size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">{estimate.distanceMiles} miles</div>
                  <div className="text-[10px] text-slate-500">Total Distance</div>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-blue-700 flex items-center gap-1 font-semibold">
                <CheckIcon size={13} /> Fixed fare lock for 15 mins
              </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                onClick={() => alert(`Redirecting to ride confirmation for ${estimate.tierName} ($${estimate.fare.toFixed(2)})`)}
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
