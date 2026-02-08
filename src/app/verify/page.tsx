"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { verifyEmail } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/auth/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email kamu berhasil diverifikasi!");
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="border-border/50 shadow-soft w-full max-w-md">
      <CardHeader className="text-center space-y-1 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Verifikasi Email Kode
        </h1>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-muted-foreground text-center">
              Sedang memverifikasi email kamu...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="space-y-2 text-center">
              <p className="text-foreground font-medium">{message}</p>
              <p className="text-muted-foreground text-sm">
                Kamu sekarang bisa masuk ke akun kamu.
              </p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/login">Masuk Sekarang</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive" />
            <div className="space-y-2 text-center">
              <p className="text-foreground font-medium">{message}</p>
              <p className="text-muted-foreground text-sm">
                Terjadi kesalahan saat memverifikasi email. Silakan coba lagi
                atau minta link baru.
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Kembali ke Login</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
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
            <Card className="border-border/50 shadow-soft w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </CardContent>
            </Card>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
