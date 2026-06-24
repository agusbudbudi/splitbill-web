import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
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
  maximumScale: 1,
  userScalable: false, // Often desired for PWAs to feel like native apps
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://splitbill.my.id"),
  title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
  description:
    "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. Aplikasi patungan terbaik yang 100% free, cepat & akurat.",
  keywords: [
    "split bill",
    "splitbill",
    "split bill online",
    "splitbill online",
    "split bill online free",
    "split bill online photo",
    "split bill online scan",
    "splitbill app",
    "split bill app",
    "split bill free",
    "split bill online with tax",
    "aplikasi bagi tagihan",
    "aplikasi split bill",
    "aplikasi patungan",
    "patungan online",
    "scan struk online",
    "cara split bill",
    "bagi tagihan restoran",
    "hitung patungan otomatis",
    "blu split bill",
    "split bill online calculator",
    "split bill whatsapp",
    "alternatif split bill bonapp",
    "alternatif chatgpt split bill",
    "split bill photo",
    "cara hitung split bill manual",
  ],
  applicationName: "Split Bill Online",
  authors: [{ name: "SplitBill Team" }],
  openGraph: {
    title: "Split Bill App - Bagi Tagihan Lebih Mudah",
    description:
      "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. 100% free!",
    url: "https://splitbill.my.id",
    siteName: "Split Bill Online",
    images: [
      {
        url: "/img/pwa-banner.png",
        width: 1200,
        height: 630,
        alt: "Split Bill App — Aplikasi Bagi Tagihan Online Gratis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bill Online - Gratis & Mudah",
    description:
      "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman.",
    images: ["/img/pwa-banner.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Split Bill Online",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/img/footer-icon.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/img/footer-icon.png",
  },
  alternates: {
    canonical: "https://splitbill.my.id",
  },
};

import { ResponsiveShell } from "@/components/layout/ResponsiveShell";
import { SessionProvider } from "next-auth/react";

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
          <SessionProvider basePath="/api/auth">
            <ResponsiveShell>
              {children}
            </ResponsiveShell>
          </SessionProvider>
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
