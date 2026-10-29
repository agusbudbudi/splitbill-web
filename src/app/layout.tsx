import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AppEntryTracker } from "@/components/providers/AppEntryTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#479fea",
  width: "device-width",
  initialScale: 1,
  // No maximumScale/userScalable: blocking pinch zoom fails accessibility audits
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

// Site-wide defaults. Pages override title/description/canonical/OG/Twitter
// through buildMetadata() so none of them inherit the homepage's tags.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
    description:
      "Split bill online gratis: scan struk pakai AI, hitung pajak dan service charge otomatis, lalu bagi tagihan ke teman lewat WhatsApp. Tanpa install aplikasi.",
    path: "/",
  }),
  // No site-wide canonical: a page without its own would otherwise claim the
  // homepage as canonical.
  alternates: undefined,
  applicationName: SITE_NAME,
  authors: [{ name: "Tim SplitBill" }],
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    // Small dedicated icons: browsers fetch these on every page at high
    // priority, so the 1000px split-bill-icon.png (kept for the PWA manifest
    // and share images) would waste ~100 KB per first visit.
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/img/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/img/apple-touch-icon.png", sizes: "180x180" },
  },
};

import { ResponsiveShell } from "@/components/layout/ResponsiveShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Inline theme script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme-storage');
                  const theme = stored ? JSON.parse(stored).state.theme : 'light';
                  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                } catch (e) {
                  // Default to light if error
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <AppEntryTracker />
        <ThemeProvider>
          <ResponsiveShell>
            {children}
          </ResponsiveShell>
        </ThemeProvider>
        <Toaster
          richColors
          closeButton
          position="top-center"
          toastOptions={{
            style: {
              maxWidth: "480px",
            },
          }}
        />
      </body>
    </html>
  );
}
