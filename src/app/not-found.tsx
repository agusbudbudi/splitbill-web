import type { Metadata } from "next";
import Link from "next/link";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan | Split Bill",
  description: "Oops! Halaman yang kamu cari tidak ada. Kembali ke SplitBill dan mulai split bill bareng teman.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fd] flex flex-col justify-between">
      {/* Header / Navbar */}
      <HomepageNavbar />

      {/* Main 404 Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-30 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#479fea]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

          {/* 404 SVG Illustration */}
          <div className="w-full max-w-[320px] mb-8">
            <svg
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              aria-hidden="true"
            >
              {/* Background circle */}
              <circle cx="200" cy="160" r="120" fill="#479fea" fillOpacity="0.06" />
              <circle cx="200" cy="160" r="90" fill="#479fea" fillOpacity="0.05" />

              {/* Receipt / Document */}
              <rect x="140" y="80" width="120" height="150" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="155" y="100" width="60" height="8" rx="4" fill="#479fea" fillOpacity="0.3" />
              <rect x="155" y="117" width="80" height="6" rx="3" fill="#e2e8f0" />
              <rect x="155" y="130" width="65" height="6" rx="3" fill="#e2e8f0" />
              <rect x="155" y="143" width="72" height="6" rx="3" fill="#e2e8f0" />
              <rect x="155" y="156" width="50" height="6" rx="3" fill="#e2e8f0" />
              {/* Zigzag tear at bottom */}
              <path d="M140 210 L150 220 L160 210 L170 220 L180 210 L190 220 L200 210 L210 220 L220 210 L230 220 L240 210 L250 220 L260 210" stroke="white" strokeWidth="3" fill="none" />

              {/* Big 404 text */}
              <text x="200" y="175" textAnchor="middle" fontSize="48" fontWeight="800" fill="#479fea" fillOpacity="0.15" fontFamily="system-ui, sans-serif">404</text>

              {/* Magnifying glass */}
              <circle cx="300" cy="100" r="28" fill="white" stroke="#479fea" strokeWidth="3" />
              <circle cx="300" cy="100" r="18" fill="#479fea" fillOpacity="0.08" stroke="#479fea" strokeWidth="2" />
              {/* X inside glass */}
              <line x1="293" y1="93" x2="307" y2="107" stroke="#479fea" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="307" y1="93" x2="293" y2="107" stroke="#479fea" strokeWidth="2.5" strokeLinecap="round" />
              {/* Handle */}
              <line x1="321" y1="121" x2="335" y2="135" stroke="#479fea" strokeWidth="4" strokeLinecap="round" />

              {/* Small floating coins */}
              <circle cx="100" cy="120" r="16" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="100" y="125" textAnchor="middle" fontSize="13" fill="#f59e0b" fontWeight="700" fontFamily="system-ui, sans-serif">Rp</text>

              <circle cx="310" cy="200" r="12" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
              <text x="310" y="205" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="700" fontFamily="system-ui, sans-serif">Rp</text>

              {/* Sad face emoji area */}
              <circle cx="80" cy="200" r="20" fill="#479fea" fillOpacity="0.1" stroke="#479fea" strokeWidth="1.5" />
              <circle cx="74" cy="196" r="2.5" fill="#479fea" />
              <circle cx="86" cy="196" r="2.5" fill="#479fea" />
              <path d="M74 206 Q80 202 86 206" stroke="#479fea" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Dotted line path from glass to receipt */}
              <path d="M275 115 Q250 130 240 145" stroke="#479fea" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" fillOpacity="0.4" />
            </svg>
          </div>

          <LoadingIndicator text="Halaman tidak ditemukan..." className="mb-6" />

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d3e] tracking-tight mb-3 leading-tight">
            Aduh, halaman ini{" "}
            <span className="text-[#479fea]">tidak ada!</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-[#64748b] font-medium leading-relaxed mb-8">
            Sepertinya URL yang kamu masukkan salah atau halaman sudah dipindahkan. Yuk balik ke beranda!
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#479fea] hover:bg-[#3b8fd4] text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg shadow-[#479fea]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Kembali ke Beranda
          </Link>

          {/* Footer note */}
          <p className="mt-8 text-xs text-[#94a3b8] font-medium">
            Butuh bantuan?{" "}
            <Link href="/faq" className="text-[#479fea] hover:underline font-semibold">
              Cek FAQ
            </Link>{" "}
            atau{" "}
            <Link href="/member" className="text-[#479fea] hover:underline font-semibold">
              masuk ke akun kamu
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <HomepageFooter />
    </div>
  );
}
