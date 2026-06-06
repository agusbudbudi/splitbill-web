"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";
import { trackAuth } from "@/lib/gtag";
import { Loader2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const avatarSeeds = ["Aria", "Bobi", "Cika"];

function RegisterPageContent() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated, initialize } = useAuthStore();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize auth state on mount (handles Google OAuth callback redirects)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/member";
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setError(null);
      setSuccess(null);
      await register(name, email, password);
      trackAuth.signUp();
      // Redirect to login page with success message and preserve redirect param
      const redirectParam = searchParams.get("redirect");
      if (redirectParam) {
        sessionStorage.setItem("auth_redirect", redirectParam);
      }
      const loginUrl = `/login?registered=true${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ""}`;
      router.push(loginUrl);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f8f9fd] flex flex-col md:flex-row items-stretch justify-stretch select-none">
      {/* Soft Background Orbs (Applied everywhere) */}
      <div className="absolute top-0 left-[-20%] w-[60%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[30%] h-[30%] bg-sky-300/5 rounded-full blur-[90px] pointer-events-none" />

      {/* LEFT SIDE PANEL (Desktop Only) - Now shifted to Right (md:order-2) */}
      <div className="hidden md:flex md:w-[50%] lg:w-[50%] flex-col justify-between pt-8 pb-10 px-8 lg:pt-10 lg:pb-12 lg:px-16 relative bg-gradient-to-bl from-primary/10 via-sky-100/30 to-indigo-100/20 border-r border-slate-100 overflow-hidden shrink-0 md:order-1">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/30" />

        {/* Logo Section - Centered */}
        <div className="relative z-10 flex justify-center w-full">
          <Link href="/" className="inline-block transition-opacity hover:opacity-85">
            <Image
              src="/img/logo-splitbill-black.png"
              alt="SplitBill Logo"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Hero Section & Large Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center gap-4 w-full mt-8 lg:mt-10">
          <div className="space-y-5 max-w-md mx-auto">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-[#2d2d3e] leading-[1.15]">
              Daftar yuk <br />
              <span className="relative inline-block text-primary">
                Gengs!
                <svg
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-full h-2 text-primary/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,10 100,5"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-slate-600 text-xs lg:text-sm font-semibold leading-relaxed">
              Bagi tagihan gak pake ribet, mulai bareng kita. Simpan riwayat transaksi dan hitung patungan lebih cepat!
            </p>
          </div>

          {/* Image + Social Proof grouped — card always anchored to bottom of image */}
          <div className="relative w-full flex flex-col items-center">
            {/* Hero Image */}
            <div className="relative w-full max-w-[340px] lg:max-w-[420px] aspect-[1080/1000] select-none pointer-events-none mx-auto">
              <Image
                src="/img/hero-login.png"
                alt="SplitBill Hero"
                fill
                className="object-contain"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Social Proof Card — overlaps transparent bottom of PNG */}
            <div className="relative z-10 flex items-center gap-3 bg-white/75 backdrop-blur-md border border-white p-3 rounded-2xl max-w-[380px] w-[90%] shadow-sm mx-auto -mt-1">
              <div className="flex items-center">
                {avatarSeeds.map((seed, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full border-2 border-white -ml-2.5 first:ml-0 overflow-hidden shrink-0 bg-secondary"
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&scale=100&seed=${encodeURIComponent(seed)}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full bg-primary text-white text-[8px] font-black flex items-center justify-center border-2 border-white -ml-2.5 shrink-0 shadow-xs">
                  10K+
                </div>
              </div>
              <div className="text-[10px] lg:text-xs font-bold text-[#2d2d3e]/80 leading-snug text-left">
                Dipakai untuk trip, kosan, dan nongkrong bareng teman. 💙
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PANEL (Mobile: Full Page, Desktop: 50% width) - Now shifted to Left (md:order-1) */}
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center py-12 px-4 sm:py-10 md:p-8 lg:p-12 relative z-10 overflow-y-auto md:order-2 md:h-full">
        <div className="w-full max-w-[440px] flex flex-col gap-4">

          {/* MOBILE ONLY TOP SECTION: Logo + Title + Hero Image */}
          <div className="block md:hidden relative">
            {/* Hero Image */}
            <div className="absolute -right-2 -top-8 w-[230px] sm:w-[240px] select-none pointer-events-none z-0">
              <Image
                src="/img/hero-login.png"
                alt="SplitBill Hero"
                width={340}
                height={400}
                className="w-full h-auto object-contain"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Logo Section */}
            <div className="flex justify-start relative z-10 px-4">
              <Link href="/" className="inline-block transition-opacity hover:opacity-85">
                <Image
                  src="/img/logo-splitbill-black.png"
                  alt="SplitBill Logo"
                  width={120}
                  height={30}
                  className="h-7 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Heading */}
            <div className="mt-6 relative z-10 px-4">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2d2d3e] leading-[1.2] max-w-[55%]">
                Daftar yuk <br />
                <span className="relative inline-block text-primary">
                  Gengs!
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,5 Q50,10 100,5"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mt-4 text-muted-foreground text-xs sm:text-sm font-semibold leading-relaxed max-w-[50%]">
                Bagi tagihan gak pake ribet, mulai bareng kita.
              </p>
            </div>

            {/* Spacer */}
            <div className="mt-[120px] sm:mt-[140px]" />
          </div>

          {/* Form Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 md:mt-0 -mt-28 sm:-mt-34"
          >
            <Card className="rounded-2xl border border-white/60 bg-white p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <CardHeader className="sr-only">
                <h2 className="text-xl font-bold">Daftar</h2>
              </CardHeader>
              <div className="space-y-1 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d2d3e] tracking-tight">
                  Buat akun barumu
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                  Yuk, patungan seru bareng circle-mu!
                </p>
              </div>

              <div className="space-y-4">
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  error={error}
                  success={success}
                />
              </div>
            </Card>
          </motion.div>

          {/* MOBILE ONLY: Social Proof Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex md:hidden items-center gap-3.5 bg-white border border-slate-100/60 p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
          >
            <div className="flex items-center">
              {avatarSeeds.map((seed, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2.5 first:ml-0 overflow-hidden shrink-0 bg-secondary"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&scale=100&seed=${encodeURIComponent(seed)}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border-2 border-white -ml-2.5 shrink-0 shadow-xs">
                10K+
              </div>
            </div>
            <div className="text-xs font-bold text-[#2d2d3e]/80 leading-snug">
              Dipakai untuk trip, kosan, dan nongkrong bareng teman. 💙
            </div>
          </motion.div>

          {/* Footer Link - Sudah punya akun */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[13px] pt-1"
          >
            <span className="text-muted-foreground/80 font-semibold">Sudah punya akun? </span>
            <Link
              href={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect") || "")}` : ""}`}
              className="text-primary font-black hover:opacity-90 inline-flex items-center gap-0.5 group transition-all"
            >
              <span>Masuk sekarang</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fd]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
