"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LogoIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  SendIcon,
  CheckIcon,
} from "@/icons/page";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#", badge: "We're hiring" },
    { label: "Press & News", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Blog", href: "#" },
  ],
  product: [
    { label: "Ride with Moventra", href: "#ride-options" },
    { label: "Drive with Us", href: "#drive" },
    { label: "Cities Served", href: "#cities" },
    { label: "Corporate Mobility", href: "#" },
    { label: "Airport Transfers", href: "#book" },
  ],
  support: [
    { label: "Help Center", href: "#faq" },
    { label: "Safety Standards", href: "#why-us" },
    { label: "Lost & Found", href: "#" },
    { label: "Rider Concierge", href: "#faq" },
    { label: "Contact Us", href: "mailto:support@moventra.com" },
  ],
  legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Driver Agreement", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-[#0A192F] text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-slate-800">
          
          {/* Brand & Newsletter: 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <LogoIcon size={36} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white font-sans flex items-center">
                  Moventra
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-1.5" />
                </span>
                <span className="text-[10px] tracking-widest uppercase text-blue-400 font-semibold -mt-1">
                  Express Taxi & Rides
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier modern urban taxi platform. Guaranteed upfront fares, verified courteous drivers, and 24/7 passenger care.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Stay updated on city launches & promos
              </span>
              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-blue-950 border border-blue-500 text-xs text-blue-400 flex items-center gap-2 font-medium">
                  <CheckIcon size={16} />
                  <span>Subscribed! You’ll receive our next city guide.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0F2344] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
                    aria-label="Subscribe to newsletter"
                  >
                    <SendIcon size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links: 8 cols */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Column 1: Company */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-xs">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-950 text-blue-400 border border-blue-500/40">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Product */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Product
              </h3>
              <ul className="space-y-2.5 text-xs">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Support
              </h3>
              <ul className="space-y-2.5 text-xs">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Legal
              </h3>
              <ul className="space-y-2.5 text-xs">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Social & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Moventra Mobility Inc. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#0F2344] text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#0F2344] text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#0F2344] text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#0F2344] text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
