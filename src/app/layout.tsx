import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { PWAInstallBanner } from "@/components/layout/PWAInstallBanner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
    "Split bill online gratis dengan scan foto struk! Aplikasi bagi tagihan paling praktis untuk patungan, split bill with tax, dan kelola keuangan bersama teman. 100% free, cepat & akurat.",
  keywords: [
    "split bill online",
    "split bill online free",
    "split bill online photo",
    "split bill online scan",
    "splitbill app",
    "split bill free",
    "split bill online with tax",
    "aplikasi bagi tagihan",
    "patungan online",
    "scan struk online",
  ],
  authors: [{ name: "SplitBill Team" }],
  openGraph: {
    title: "Split Bill App - Bagi Tagihan Lebih Mudah",
    description:
      "Split bill online gratis dengan scan foto! Bagi tagihan & patungan otomatis, support pajak. 100% free!",
    url: "https://splitbill.my.id",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/pwa-banner.png",
        width: 1200,
        height: 630,
        alt: "Split Bill App - Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bill Online - Gratis & Mudah",
    description: "Split bill online gratis! Scan foto struk, hitung otomatis, bagi tagihan dengan pajak.",
    images: ["/img/pwa-banner.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Split Bill App",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/img/footer-icon.png",
  },
  alternates: {
    canonical: "https://splitbill.my.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
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
        <ThemeProvider>
          <PWAInstallBanner />
          {children}
        </ThemeProvider>
        <Toaster
          richColors
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
