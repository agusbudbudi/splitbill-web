"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  validateEmail,
  validateName,
  validatePassword,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/lib/auth/utils";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
  success,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validation
    let hasError = false;

    if (!validateName(name)) {
      setNameError("Nama harus minimal 2 karakter dan hanya berisi huruf");
      hasError = true;
    }

    if (!validateEmail(email)) {
      setEmailError("Gunakan alamat email yang valid dan aktif");
      hasError = true;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(
        "Password minimal 8 karakter dan harus mengandung huruf atau angka",
      );
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Konfirmasi password tidak cocok");
      hasError = true;
    }

    if (hasError) return;

    await onSubmit(name, email, password);
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

      {/* Nama Lengkap Input */}
      <div className="space-y-2 group">
        <label
          htmlFor="name"
          className="text-xs font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1"
        >
          Nama Lengkap
        </label>
        <div className="relative group/input">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name && !validateName(name)) {
                setNameError(
                  "Nama harus minimal 2 karakter dan hanya berisi huruf",
                );
              } else {
                setNameError("");
              }
            }}
            className="pl-12 h-14 bg-white border border-slate-100 hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium text-base text-foreground placeholder:text-muted-foreground/30"
            disabled={isLoading}
          />
        </div>
        {nameError && (
          <p className="text-xs text-destructive font-bold ml-1">{nameError}</p>
        )}
      </div>

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
                setEmailError("Gunakan alamat email yang valid dan aktif");
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
        {!emailError && (
          <p className="text-[10px] text-muted-foreground font-semibold ml-1">
            Pastikan email aktif ya, buat verifikasi sat set!
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
            placeholder="Minimal 8 karakter"
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
        {passwordStrength && (
          <p
            className="text-[11px] font-bold ml-1 mt-1"
            style={{ color: getPasswordStrengthColor(passwordStrength) }}
          >
            Kekuatan password: {getPasswordStrengthLabel(passwordStrength)}
          </p>
        )}
        {passwordError && (
          <p className="text-xs text-destructive font-bold ml-1 mt-1">
            {passwordError}
          </p>
        )}
      </div>

      {/* Konfirmasi Password Input */}
      <div className="space-y-2 group">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1"
        >
          Konfirmasi Password
        </label>
        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => {
              if (confirmPassword && confirmPassword !== password) {
                setConfirmPasswordError("Konfirmasi password tidak cocok");
              } else {
                setConfirmPasswordError("");
              }
            }}
            className="pl-12 pr-12 h-14 bg-white border border-slate-100 hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium text-base text-foreground placeholder:text-muted-foreground/30"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {confirmPasswordError && (
          <p className="text-xs text-destructive font-bold ml-1 mt-1">
            {confirmPasswordError}
          </p>
        )}
      </div>

      <p className="text-[9px] text-muted-foreground text-center px-4 leading-relaxed">
        Dengan mendaftar, kamu menyetujui{" "}
        <Link href="/terms" className="text-primary font-black hover:underline">
          Syarat & Ketentuan
        </Link>{" "}
        dan{" "}
        <Link href="/privacy" className="text-primary font-black hover:underline">
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>

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
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
