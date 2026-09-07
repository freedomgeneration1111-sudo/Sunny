import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatTeaser } from "@/components/operations/ChatTeaser";
import { PublicChatProvider } from "@/components/operations/NativeChatPanel";
import { PlanProvider } from "@/components/planning/PlanProvider";
import { config } from "@/lib/config";
import { localBusinessJsonLd } from "@/lib/jsonld";
import "./globals.css";
import "./redesign.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const isReviewBuild = process.env.NEXT_PUBLIC_PUBLICATION_STAGE === "review";

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: { default: `${config.businessName} — DFW Weddings & Events`, template: `%s | ${config.businessName}` },
  description: config.shortStatement,
  robots: isReviewBuild ? { index: false, follow: false } : undefined,
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#111214", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
        <PublicChatProvider>
          <PlanProvider>
            <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-control bg-brand-primary px-4 py-3 font-bold text-on-brand focus:translate-y-0">Skip to content</a>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <ChatTeaser />
          </PlanProvider>
        </PublicChatProvider>
        <GoogleAnalytics gaId="G-9T3S01EDXH" />
      </body>
    </html>
  );
}
