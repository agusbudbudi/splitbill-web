"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/auth/utils";
import { LoginCredentials } from "@/lib/stores/authStore";
import { motion } from "framer-motion";

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

    if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter");
      hasError = true;
    }

    if (hasError) return;

    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <span className="text-destructive font-bold text-xs">!</span>
          </div>
          <div className="text-destructive text-sm font-semibold">{error}</div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="text-green-500 font-bold text-xs">✓</span>
          </div>
          <div className="text-green-500 text-sm font-semibold">{success}</div>
        </motion.div>
      )}

      {/* Email Input */}
      <div className="space-y-2 group">
        <label
          htmlFor="email"
          className="text-xs font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1"
        >
          Email
        </label>
        <div className="relative group/input">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="split.bill.apps@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                setEmailError("Format email tidak valid");
              } else {
                setEmailError("");
              }
            }}
            className="pl-12 h-14 bg-white border border-slate-100 hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium text-base text-foreground placeholder:text-muted-foreground/30"
            disabled={isLoading}
          />
        </div>
        {emailError && (
          <p className="text-xs text-destructive font-bold ml-1">
            {emailError}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2 group">
        <label
          htmlFor="password"
          className="text-xs font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1"
        >
          Password
        </label>
        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-white border border-slate-100 hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium text-base text-foreground placeholder:text-muted-foreground/30"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors cursor-pointer"
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
          <p className="text-xs text-destructive font-bold ml-1">
            {passwordError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 text-base font-bold shadow-md shadow-primary/10 hover:shadow-primary/25 transition-all rounded-2xl bg-primary hover:bg-primary/90 text-white border-none flex items-center justify-center gap-2 cursor-pointer group"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </div>
          ) : (
            <>
              <span>Masuk ke SplitBill</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
