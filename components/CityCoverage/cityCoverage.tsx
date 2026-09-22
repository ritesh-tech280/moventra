"use client";

import React, { useState } from "react";
import {
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  CheckIcon,
  SendIcon,
  CloseIcon,
} from "@/icons/page";

interface DestinationItem {
  name: string;
  region: string;
  knownFor: string;
  monthlyRiders: number;
  image: string;
}

const popularDestinations: DestinationItem[] = [
  {
    name: "New Delhi",
    region: "National Capital Territory",
    knownFor: "India Gate, Red Fort, Connaught Place",
    monthlyRiders: 5200,
    image: "https://loremflickr.com/600/450/newdelhi,indiagate,india",
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    knownFor: "Ganga Aarti, Yoga Capital, Laxman Jhula",
    monthlyRiders: 3100,
    image: "https://loremflickr.com/600/450/rishikesh,ganges,india",
  },
  {
    name: "Haridwar",
    region: "Uttarakhand",
    knownFor: "Har Ki Pauri, Kumbh Mela, Ganga Ghats",
    monthlyRiders: 3400,
    image: "https://loremflickr.com/600/450/haridwar,harkipauri,india",
  },
  {
    name: "Prayagraj",
    region: "Uttar Pradesh",
    knownFor: "Triveni Sangam, Kumbh Mela, Allahabad Fort",
    monthlyRiders: 2600,
    image: "https://loremflickr.com/600/450/prayagraj,sangam,india",
  },
  {
    name: "Varanasi",
    region: "Uttar Pradesh",
    knownFor: "Ganga Ghats, Kashi Vishwanath Temple",
    monthlyRiders: 2900,
    image: "https://loremflickr.com/600/450/varanasi,ghats,india",
  },
  {
    name: "Agra",
    region: "Uttar Pradesh",
    knownFor: "Taj Mahal, Agra Fort",
    monthlyRiders: 4100,
    image: "https://loremflickr.com/600/450/tajmahal,agra,india",
  },
  {
    name: "Jaipur",
    region: "Rajasthan",
    knownFor: "Hawa Mahal, Amber Fort, Pink City",
    monthlyRiders: 3300,
    image: "https://loremflickr.com/600/450/jaipur,hawamahal,india",
  },
  {
    name: "Amritsar",
    region: "Punjab",
    knownFor: "Golden Temple, Wagah Border",
    monthlyRiders: 2400,
    image: "https://loremflickr.com/600/450/amritsar,goldentemple,india",
  },
];

export default function CityCoverage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedCity, setRequestedCity] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const filteredDestinations = popularDestinations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedCity.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestedCity("");
      setRequestSubmitted(false);
      setIsModalOpen(false);
    }, 2400);
  };

  return (
    <section id="cities" className="py-20 lg:py-28 bg-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <MapPinIcon size={14} />
            <span>Most Visited Across India</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Popular Destinations
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From sacred ghats to iconic monuments, Moventra takes you to India&rsquo;s most loved pilgrimage and tourist destinations with prompt, reliable rides.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-blue-600">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by destination or state (e.g. Rishikesh, Rajasthan)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.name}
              className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={`${dest.name}, ${dest.region}`}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold text-blue-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Available Now
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                      {dest.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono font-medium whitespace-nowrap">
                      {dest.monthlyRiders.toLocaleString()}+ riders
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{dest.region}</p>

                  <div className="text-xs text-slate-600 py-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">Known for: </span>
                    <span className="font-semibold text-slate-700">{dest.knownFor}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#book"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Book here →
                  </a>
                  <span className="text-[10px] text-slate-400 font-mono">24/7 Service</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">
              No destinations found matching &ldquo;{searchTerm}&rdquo;.
            </p>
          </div>
        )}

        {/* Mini CTA: Request Your City */}
        <div className="mt-14 max-w-2xl mx-auto text-center p-7 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold mb-2">
            <SparklesIcon size={14} />
            <span>Expanding Rapidly</span>
          </div>
          <h4 className="text-lg font-bold text-[#0F172A] mb-2">
            Don&rsquo;t see your destination on our coverage map?
          </h4>
          <p className="text-xs text-slate-600 mb-5">
            We launch in new cities and destinations every quarter based on rider demand votes.
          </p>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Request Your City</span>
            <SendIcon size={14} />
          </button>
        </div>

        {/* Modal: Request City */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon size={20} />
              </button>

              <div className="flex items-center gap-2.5 text-blue-600 mb-4">
                <MapPinIcon size={22} />
                <h3 className="text-xl font-bold text-[#0F172A]">Request a City</h3>
              </div>

              {requestSubmitted ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
                    <CheckIcon size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">City Vote Recorded!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you. We will alert you the moment Moventra pilots in your region.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestCitySubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Tell us where you want Moventra next. We prioritize driver recruiting based on vote volume.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City, State, Country
                    </label>
                    <input
                      type="text"
                      value={requestedCity}
                      onChange={(e) => setRequestedCity(e.target.value)}
                      placeholder="e.g. Ujjain, Madhya Pradesh, India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow hover:scale-[1.01] transition-transform"
                  >
                    Submit City Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}