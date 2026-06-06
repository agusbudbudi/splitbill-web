"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useAuthStore } from "@/lib/stores/authStore";
import { trackAuth } from "@/lib/gtag";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  callbackUrl?: string;
}

export function GoogleLoginButton({ onSuccess, callbackUrl }: GoogleLoginButtonProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const { loginWithGoogle, isLoading: storeLoading } = useAuthStore();
  const isLoading = localLoading || storeLoading;

  const handleGoogleLogin = async () => {
    trackAuth.googleLoginClicked();
    setLocalLoading(true);

    try {
      // Trigger Google login flow via NextAuth.
      // NextAuth will redirect to Google, complete OAuth, and redirect back to this page.
      // Use the provided callbackUrl or fall back to current page (client-only)
      const resolvedCallback = callbackUrl || (typeof window !== "undefined" ? window.location.href : "/");
      await signIn("google", { callbackUrl: resolvedCallback });
    } catch (error: any) {
      console.error("Google Auth error:", error);
      const errMsg = error?.message || "Terjadi kesalahan saat masuk dengan Google";
      toast.error(errMsg);
      trackAuth.googleLoginFailed(errMsg);
      setLocalLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full h-14 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors rounded-2xl flex items-center justify-center gap-3 font-semibold text-foreground cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      ) : (
        <svg
          className="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.03-1.21-.16-1.85-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{isLoading ? "Menghubungkan..." : "Lanjutkan dengan Google"}</span>
    </button>
  );
}
