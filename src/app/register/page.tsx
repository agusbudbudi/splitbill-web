"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";
import { motion } from "framer-motion";
import { Receipt, Wallet, CircleDollarSign, Coins } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setError(null);
      setSuccess(null);
      await register(name, email, password);
      // Redirect to login page with success message
      router.push("/login?registered=true");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-start p-4 pt-16 md:pt-18">
      {/* Background decoration - subtle gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px]" />
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
              <img
                src="/img/logo-splitbill-black.png"
                alt="SplitBill Logo"
                className="h-10 w-auto mx-auto"
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
              Daftar yuk <span className="text-primary">Gengs!</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Bagi tagihan gak pake ribet, mulai bareng kita.
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
              <h2 className="text-xl font-bold">Daftar</h2>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-4">
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={isLoading}
                error={error}
                success={success}
              />

              <div className="text-center text-sm pt-2">
                <span className="text-muted-foreground">
                  Sudah punya akun?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-primary font-extrabold hover:text-primary/80 transition-colors"
                >
                  Masuk sekarang
                </Link>
              </div>
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
