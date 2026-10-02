import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/components/store-provider";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";
import "./misc.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const catalogLive = process.env.NEXT_PUBLIC_CATALOG_LIVE === "true";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "RNT Footwear — Ruf N Tuf", template: "%s — RNT Footwear" },
  description: "Explore RNT sports shoes, campaign artwork, and the 2026 collection.",
  openGraph: { type: "website", siteName: "RNT Footwear", title: "RNT Footwear — Ruf N Tuf", description: "RNT sports shoes and the 2026 collection.", url: "/" },
  robots: catalogLive ? { index: true, follow: true } : { index: false, follow: false }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080a0c" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning><StoreProvider><SiteChrome>{children}</SiteChrome></StoreProvider></body></html>;
}

