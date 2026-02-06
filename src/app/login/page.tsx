"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/img/logo-splitbill-black.png"
              alt="SplitBill Logo"
              className="h-12 w-auto mx-auto cursor-pointer"
            />
          </Link>
        </div>

        <Card className="border-border/50 shadow-soft">
          <CardHeader className="text-center space-y-1 pb-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-muted-foreground text-sm">
              Masuk untuk melanjutkan
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">Belum punya akun? </span>
              <Link
                href="/register"
                className="text-primary font-bold hover:underline"
              >
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
