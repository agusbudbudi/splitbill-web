"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore, LoginCredentials } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";
import { trackAuth } from "@/lib/gtag";
import {
  Loader2,
  Zap,
  Calculator,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const features = [
  { label: "Split otomatis", icon: Zap },
  { label: "Tanpa kalkulator", icon: Calculator },
  { label: "Real-time tracking", icon: Clock },
];

const avatarSeeds = ["Aria", "Bobi", "Cika"];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [emailForResend, setEmailForResend] = useState("");

  // Check for registration success message
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(
        "Registrasi berhasil! Silakan cek email kamu untuk verifikasi akun sebelum masuk.",
      );
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setSuccess(null);
      setShowResend(false);
      setEmailForResend(credentials.email);
      await login(credentials);
      trackAuth.login();
      setSuccess("Login berhasil! Mengalihkan...");

      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // If error is 403 (Forbidden), it means email is not verified
      if (
        err.status === 403 ||
        errorMessage.toLowerCase().includes("verifikasi") ||
        errorMessage.toLowerCase().includes("verify")
      ) {
        setShowResend(true);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!emailForResend) return;

    try {
      setResending(true);
      setError(null);
      const { resendVerification } = await import("@/lib/api/auth");
      const response = await resendVerification(emailForResend);
      setSuccess(response.message || "Email verifikasi telah dikirim ulang.");
      setShowResend(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        success={success}
      />

      {showResend && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center space-y-2"
        >
          <p className="text-sm text-foreground">
            Email kamu belum diverifikasi. Cek folder Inbox atau Spam kamu.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full rounded-xl"
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Ulang Email Verifikasi"
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default function LoginPage() {
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
              Split tagihan <br />
              jadi{" "}
              <span className="relative inline-block text-primary">
                gampang.
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
              Patungan trip &amp; nongkrong tanpa ribet hitung manual.
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
              <h2 className="text-xl font-bold">Masuk</h2>
            </CardHeader>
            <div className="space-y-1 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#2d2d3e] tracking-tight">
                Masuk ke akunmu
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                Yuk, lanjut split bareng temanmu!
              </p>
            </div>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <LoginContent />
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

        {/* Footer Link - Belum punya akun */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[13px] pt-1"
        >
          <span className="text-muted-foreground/80 font-semibold">Belum punya akun? </span>
          <Link
            href="/register"
            className="text-primary font-black hover:opacity-90 inline-flex items-center gap-0.5 group transition-all"
          >
            <span>Daftar sekarang</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
