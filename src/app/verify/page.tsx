"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { verifyEmail, resendVerification } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/auth/utils";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

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

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setResendStatus("loading");
    try {
      const response = await resendVerification(email);
      setResendStatus("success");
      setResendMessage(response.message);
    } catch (error) {
      setResendStatus("error");
      setResendMessage(getErrorMessage(error));
    }
  };

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

            {!showResendForm ? (
              <div className="w-full space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setShowResendForm(true)}
                >
                  Kirim Ulang Email Verifikasi
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Kembali ke Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResend} className="w-full space-y-4">
                {resendStatus === "success" ? (
                  <div className="bg-green-500/10 text-green-600 p-4 rounded-sm text-sm border border-green-500/20 flex items-start gap-3">
                    <Mail className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{resendMessage}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium px-1">
                        Masukkan Email Anda
                      </label>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={resendStatus === "loading"}
                      />
                    </div>
                    {resendStatus === "error" && (
                      <p className="text-destructive text-sm px-1">
                        {resendMessage}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={resendStatus === "loading"}
                    >
                      {resendStatus === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Kirim Link Baru
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowResendForm(false)}
                      disabled={resendStatus === "loading"}
                    >
                      Batal
                    </Button>
                  </>
                )}
              </form>
            )}
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
