"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/auth/utils";
import { LoginCredentials } from "@/lib/stores/authStore";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
}

export function LoginForm({
  onSubmit,
  isLoading,
  error,
  success,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Validation
    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError("Format email tidak valid");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      hasError = true;
    }

    if (hasError) return;

    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <span className="text-destructive font-bold">!</span>
          </div>
          <div className="text-destructive text-sm font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <span className="text-green-500 font-bold">✓</span>
          </div>
          <div className="text-green-500 text-sm font-medium">{success}</div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-foreground"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                setEmailError("Format email tidak valid");
              } else {
                setEmailError("");
              }
            }}
            className="pl-12"
            disabled={isLoading}
          />
        </div>
        {emailError && (
          <p className="text-xs text-destructive font-medium">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="text-xs text-destructive font-medium">
            {passwordError}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
