"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogoIcon,
  MenuIcon,
  CloseIcon,
  ArrowRightIcon,
  CarIcon,
} from "@/icons/page";

export interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Ride Options", href: "#ride-options" },
  { label: "Why Moventra", href: "#why-us" },
  { label: "Cities", href: "#cities" },
  { label: "Drive with us", href: "#drive" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5"
          : "bg-white/80 backdrop-blur-sm lg:bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
            aria-label="Moventra Homepage"
          >
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <LogoIcon size={38} />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#0F172A] font-sans flex items-center">
                Moventra
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 ml-1.5 animate-pulse" />
              </span>
              <span className="text-[10px] tracking-widest uppercase text-blue-600 font-semibold -mt-1">
                Express Taxi & Rides
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 backdrop-blur-md"
            aria-label="Primary Navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="#book"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="#book"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <CarIcon size={16} className="transition-transform group-hover:-translate-y-0.5" />
              <span>Book a Ride</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      <div
        className={`fixed inset-0 top-[70px] z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-[calc(100vh-70px)] bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Menu
              </span>
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <ArrowRightIcon
                    size={16}
                    className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-3">
            <Link
              href="#book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Log in
            </Link>
            <Link
              href="#book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-transform active:scale-[0.98]"
            >
              <CarIcon size={18} />
              <span>Book a Ride</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
