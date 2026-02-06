"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";

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
      setSuccess("Yeay registrasi berhasil...");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
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
              Buat Akun Baru
            </h1>
            <p className="text-muted-foreground text-sm">Daftar untuk mulai</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
              success={success}
            />

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Link
                href="/login"
                className="text-primary font-bold hover:underline"
              >
                Masuk sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
