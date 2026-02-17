"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore, LoginCredentials } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";
import {
  Loader2,
  Receipt,
  Wallet,
  CircleDollarSign,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

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
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setSuccess(null);
      setShowResend(false);
      setEmailForResend(credentials.email);
      await login(credentials);
      setSuccess("Login berhasil! Mengalihkan...");
      router.push("/");
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
      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Belum punya akun? </span>
        <Link
          href="/register"
          className="text-primary font-extrabold hover:text-primary/80 transition-colors"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-start p-4 pt-16 md:pt-18">
      {/* Background decoration - subtle gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] space-y-8">
        {/* Branding Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="inline-block">
              <Image
                src="/img/logo-splitbill-black.png"
                alt="SplitBill Logo"
                width={160}
                height={40}
                className="h-10 w-auto mx-auto"
                priority
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Masuk yuk <span className="text-primary">Gengs!</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Gak perlu kalkulator. Split bill otomatis, langsung beres.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-soft backdrop-blur-sm bg-white/80 overflow-hidden relative">
            <CardHeader className="sr-only">
              <h2 className="text-xl font-bold">Masuk</h2>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
              >
                <LoginContent />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] font-medium text-muted-foreground/40 "
        >
          &copy; 2026 SplitBill • Smart Way to Split Expenses
        </motion.p>
      </div>
    </div>
  );
}
