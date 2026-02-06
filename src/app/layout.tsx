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
  themeColor: "#7056ec",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often desired for PWAs to feel like native apps
};

export const metadata: Metadata = {
  metadataBase: new URL("https://splitbill.my.id"),
  title: "Split Bill App - Bagi Tagihan Lebih Mudah",
  description:
    "Buat dan bagikan pembagian tagihan secara otomatis dengan Split Bill App. Praktis dan cepat!",
  keywords: [
    "split bill",
    "bagi tagihan",
    "invoice builder",
    "shared goals",
    "patungan",
  ],
  authors: [{ name: "SplitBill Team" }],
  openGraph: {
    title: "Split Bill App - Bagi Tagihan Lebih Mudah",
    description:
      "Buat dan bagikan pembagian tagihan secara otomatis. Praktis dan cepat!",
    url: "https://splitbill.my.id",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/banner-splitbill.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bill App - Bagi Tagihan Lebih Mudah",
    description: "Buat dan bagikan pembagian tagihan secara otomatis.",
    images: ["/img/banner-splitbill.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
