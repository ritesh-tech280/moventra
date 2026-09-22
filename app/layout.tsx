import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0B1713",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Moventra — Premium Eco & Express Taxi Booking",
  description:
    "Your ride, on your schedule. Guaranteed upfront flat fares, verified 5-star courteous drivers, and 100% electrified or hybrid fleet options across 50+ cities.",
  keywords: [
    "taxi booking",
    "cab service",
    "airport taxi",
    "eco ride hail",
    "express taxi",
    "Moventra",
    "scheduled rides",
  ],
  authors: [{ name: "Moventra Mobility Inc." }],
  openGraph: {
    title: "Moventra — Premium Eco & Express Taxi Booking",
    description:
      "Your ride, on your schedule. Flat guaranteed pricing, verified drivers, and prompt dispatch in 50+ metropolitan cities.",
    type: "website",
    locale: "en_US",
    siteName: "Moventra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moventra — Premium Eco & Express Taxi Booking",
    description:
      "Your ride, on your schedule. Flat guaranteed pricing, verified drivers, and prompt dispatch.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
