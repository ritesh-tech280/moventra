"use client";

import React, { useState } from "react";
import { ChevronDownIcon, HeadphonesIcon } from "@/icons/page";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Booking",
    question: "How do I book a ride and how far in advance can I schedule?",
    answer:
      "You can book instantly in under 30 seconds using our web portal or mobile app. For airport transfers, early morning meetings, or special occasions, you can schedule rides up to 30 days in advance with guaranteed driver assignment.",
  },
  {
    category: "Pricing & Payment",
    question: "Are Moventra prices fixed or do they surge during peak hours?",
    answer:
      "Moventra operates on an upfront transparent pricing model. The fare you see on the estimator before requesting your ride is guaranteed and locked. We do not apply unexpected 3x surge multipliers in bad weather or rush hours.",
  },
  {
    category: "Cancellations",
    question: "What is your cancellation policy?",
    answer:
      "You can cancel free of charge within 5 minutes of driver matching, or anytime before a scheduled advance ride is dispatched (up to 60 minutes before pickup). If cancelled after a driver has arrived at your curb, a modest flat dispatch fee of $5 is applied to compensate the driver's fuel and time.",
  },
  {
    category: "Safety",
    question: "What safety measures and driver verification checks do you conduct?",
    answer:
      "Passenger safety is paramount. All driver partners undergo extensive multi-jurisdictional background checks, DMV motor vehicle record audits, vehicle inspections, and identity verification. All rides are tracked live via telemetry with emergency 24/7 in-app dispatch assistance.",
  },
  {
    category: "Vehicles & Luggage",
    question: "How do I choose the right vehicle size for my group and luggage?",
    answer:
      "Our fleet includes Eco Mini (up to 3 passengers, 2 standard bags), Comfort Sedan (up to 4 passengers, 3 bags), and Executive SUV (up to 6 passengers, 5 large suitcases). If you are carrying golf clubs, strollers, or excess baggage, we strongly recommend selecting the Executive SUV class.",
  },
  {
    category: "Driving with us",
    question: "What are the basic requirements to become a Moventra driver?",
    answer:
      "Drivers must be at least 21 years old, possess a valid driver's license with at least 1 year of driving experience, operate an eligible 4-door vehicle (model year 2016 or newer in excellent cosmetic and mechanical shape), and clear our background check. Drivers keep up to 88% of passenger fares with daily cashout.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white text-slate-900 border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Everything you need to know about booking, fare calculation, driver safety, and ride scheduling.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? "bg-white border-blue-600 shadow-md"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <button
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleAccordion(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleAccordion(index);
                    }
                  }}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      0{index + 1}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0F172A]">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <ChevronDownIcon size={18} />
                  </div>
                </button>

                {/* Collapsible Content */}
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HeadphonesIcon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Still have questions?</h4>
              <p className="text-xs text-slate-600">Our 24/7 rider concierge team is available to help.</p>
            </div>
          </div>
          <a
            href="mailto:support@moventra.com"
            className="px-4 py-2 rounded-xl bg-[#0A192F] text-white hover:bg-blue-600 text-xs font-bold transition-colors shrink-0"
          >
            Contact Rider Support
          </a>
        </div>

      </div>
    </section>
  );
}
