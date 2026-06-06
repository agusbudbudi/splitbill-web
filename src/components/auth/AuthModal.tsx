"use client";

import React from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { GoogleLoginButton } from "./GoogleLoginButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  redirectPath?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, redirectPath = "/member" }: AuthModalProps) {
  const searchParams = useSearchParams();
  const currentRedirect = searchParams.get("redirect") || redirectPath;

  // Build an absolute callback URL for NextAuth Google OAuth
  const googleCallbackUrl = typeof window !== "undefined"
    ? `${window.location.origin}${currentRedirect}`
    : currentRedirect;

  const loginUrl = `/login?redirect=${encodeURIComponent(currentRedirect)}`;
  const registerUrl = `/register?redirect=${encodeURIComponent(currentRedirect)}`;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showBackButton={false}
    >
      <div className="flex flex-col items-center text-center p-2 space-y-6">
        {/* Safe Icon */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
          <ShieldCheck className="w-9 h-9" />
        </div>

        {/* Text Details */}
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-black text-foreground">
            Simpan Split Bill Kamu
          </h3>
          <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
            Yuk masuk, supaya split bill tersimpan dan siap di-share kapan aja.
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="w-full space-y-3 pt-2">
          {/* Google Button */}
          <GoogleLoginButton
            callbackUrl={googleCallbackUrl}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onClose();
            }}
          />

          {/* Email Divider & Link */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider">
              atau
            </span>
          </div>

          <Link
            href={loginUrl}
            onClick={onClose}
            className="w-full h-14 border border-dashed border-primary/20 hover:border-primary/40 text-primary transition-colors rounded-2xl flex items-center justify-center gap-3 font-bold cursor-pointer"
          >
            <Mail className="w-5 h-5" />
            <span>Masuk dengan Email</span>
          </Link>
        </div>

        {/* Footer/Register link */}
        <div className="text-xs font-semibold text-muted-foreground pt-2">
          Belum punya akun?{" "}
          <Link
            href={registerUrl}
            onClick={onClose}
            className="text-primary font-black hover:underline"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </BottomSheet>
  );
}
