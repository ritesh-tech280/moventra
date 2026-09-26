import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/Auth/authModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Moventra — Cab Booking Across India",
  description:
    "Book city, airport and outstation rides across India. Compare vehicle options and view fare estimates in Indian rupees.",
  keywords: [
    "taxi booking",
    "cab service",
    "airport taxi",
    "India cab booking",
    "express taxi",
    "Moventra",
    "scheduled rides",
  ],
  authors: [{ name: "Moventra" }],
  openGraph: {
    title: "Moventra — Cab Booking Across India",
    description:
      "Book city, airport and outstation rides across India with clear fare estimates in Indian rupees.",
    type: "website",
    locale: "en_IN",
    siteName: "Moventra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moventra — Cab Booking Across India",
    description:
      "Book city, airport and outstation rides across India with fare estimates in Indian rupees.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0F172A]">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
