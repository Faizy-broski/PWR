import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { RouteLoader } from "@/components/motion/route-loader";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PWR Competitions",
    template: "%s | PWR Competitions",
  },
  description:
    "Enter PWR's prize competitions for a chance to win cars, tech, and cash.",
  openGraph: {
    type: "website",
    siteName: "PWR Competitions",
    title: "PWR Competitions",
    description:
      "Enter PWR's prize competitions for a chance to win cars, tech, and cash.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PWR Competitions",
    description:
      "Enter PWR's prize competitions for a chance to win cars, tech, and cash.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0C0C",
};

// Navbar/Footer live in app/(marketing)/layout.tsx, not here — the admin
// section renders without the public site chrome.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RouteLoader />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Toaster />
      </body>
    </html>
  );
}
