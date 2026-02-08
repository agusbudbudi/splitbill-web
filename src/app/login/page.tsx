"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore, LoginCredentials } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/auth/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <Card className="border-border/50 shadow-soft">
      <CardHeader className="text-center space-y-1 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
        <p className="text-muted-foreground text-sm">Masuk untuk melanjutkan</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
          success={success}
        />

        {showResend && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center space-y-2">
            <p className="text-sm text-foreground">
              Email kamu belum diverifikasi. Cek folder Inbox atau Spam kamu.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full"
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
          </div>
        )}
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
  );
}

export default function LoginPage() {
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

        <Suspense
          fallback={
            <Card className="border-border/50 shadow-soft">
              <CardContent className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
