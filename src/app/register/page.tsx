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

function RegisterContent() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
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
      const loginUrl = `/login?registered=true${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ""}`;
      router.push(loginUrl);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#f8f9fd] flex flex-col items-center justify-start py-8 px-4 sm:py-10 overflow-hidden select-none">

      {/* Soft Background Orbs */}
      <div className="absolute top-0 left-[-20%] w-[60%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[30%] h-[30%] bg-sky-300/5 rounded-full blur-[90px] pointer-events-none" />



      {/* Unified Portrait Container */}
      <div className="relative z-10 w-full max-w-[460px] flex flex-col gap-4">

        {/* Top Section: Logo + Heading + Hero (relative wrapper for hero positioning) */}
        <div className="relative">

          {/* Hero Image — absolutely positioned right side, spanning from top to overlap card */}
          <div className="absolute -right-2 -top-8 w-[230px] sm:w-[240px] select-none pointer-events-none z-0">
            <Image
              src="/img/hero-login.png"
              alt="SplitBill Hero"
              width={340}
              height={400}
              className="w-full h-auto object-contain"
              priority
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

          {/* Heading — left-aligned text, hero peeks from right */}
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

          {/* Spacer: controls how much of the hero shows above the card */}
          <div className="mt-[120px] sm:mt-[140px]" />
        </div>

        {/* Main Card — z-10 so hero overlaps behind it from the right */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 -mt-28 sm:-mt-34"
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
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <RegisterContent />
            </Suspense>
          </Card>
        </motion.div>

        {/* Social Proof Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3.5 bg-white border border-slate-100/60 p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
        >
          {/* Avatars */}
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
          {/* Social proof text */}
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
            href="/login"
            className="text-primary font-black hover:opacity-90 inline-flex items-center gap-0.5 group transition-all"
          >
            <span>Masuk sekarang</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
