import type { Metadata } from "next";
import {
  Caveat,
  DM_Serif_Display,
  IBM_Plex_Mono,
  Outfit,
} from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const hand = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
});

const ui = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Your Life, In Receipts",
  description:
    "A frontend-only story of a ledger and a lifetime of music — receipts that remember.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${hand.variable} ${ui.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
