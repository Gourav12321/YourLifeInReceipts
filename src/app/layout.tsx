import type { Metadata, Viewport } from "next";
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
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const hand = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const ui = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Your Life, In Receipts",
    template: "%s · Your Life, In Receipts",
  },
  description:
    "A frontend-only story of a personal ledger and a lifetime of music — receipts, rituals, constellations, and the songs that kept returning.",
  applicationName: "Your Life, In Receipts",
  authors: [{ name: "Gourav Maurya" }],
  keywords: [
    "receipts",
    "ledger",
    "spotify",
    "storytelling",
    "constellations",
    "hackathon",
    "nextjs",
  ],
  openGraph: {
    title: "Your Life, In Receipts",
    description:
      "What if your spending history and your music history remembered each other?",
    type: "website",
    url: "https://web-teal-two-93.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Life, In Receipts",
    description:
      "A scrollable story built from a ledger and Spotify plays — no backend.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0c" },
    { media: "(prefers-color-scheme: light)", color: "#1a130e" },
  ],
  viewportFit: "cover",
  colorScheme: "dark",
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
