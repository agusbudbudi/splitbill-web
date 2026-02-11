"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
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
      setEmailError("Format email tidak valid");
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
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <span className="text-destructive font-bold">!</span>
          </div>
          <div className="text-destructive text-sm font-semibold">{error}</div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="text-success text-sm font-semibold">{success}</div>
        </motion.div>
      )}

      <div className="space-y-1 group">
        <label
          htmlFor="name"
          className="text-sm font-bold text-foreground/80 group-focus-within:text-primary transition-colors ml-1"
        >
          Nama Lengkap
        </label>
        <div className="relative group/input">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors" />
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
            className="pl-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-md font-medium"
            disabled={isLoading}
          />
        </div>
        {nameError && (
          <p className="text-xs text-destructive font-bold ml-1">{nameError}</p>
        )}
      </div>

      <div className="space-y-1 group">
        <label
          htmlFor="email"
          className="text-sm font-bold text-foreground/80 group-focus-within:text-primary transition-colors ml-1"
        >
          Email
        </label>
        <div className="relative group/input">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                setEmailError("Format email tidak valid");
              } else {
                setEmailError("");
              }
            }}
            className="pl-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-md font-medium"
            disabled={isLoading}
          />
        </div>
        {emailError && (
          <p className="text-xs text-destructive font-bold ml-1">
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-1 group">
        <label
          htmlFor="password"
          className="text-sm font-bold text-foreground/80 group-focus-within:text-primary transition-colors ml-1"
        >
          Password
        </label>
        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-md font-medium"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
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
            className="text-xs font-bold ml-1"
            style={{ color: getPasswordStrengthColor(passwordStrength) }}
          >
            Kekuatan password: {getPasswordStrengthLabel(passwordStrength)}
          </p>
        )}
        {passwordError && (
          <p className="text-xs text-destructive font-bold ml-1">
            {passwordError}
          </p>
        )}
      </div>

      <div className="space-y-1 group">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-bold text-foreground/80 group-focus-within:text-primary transition-colors ml-1"
        >
          Konfirmasi Password
        </label>
        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors" />
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
            className="pl-12 pr-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-md font-medium"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
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
          <p className="text-xs text-destructive font-bold ml-1">
            {confirmPasswordError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all rounded-md bg-primary border-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memproses...</span>
          </div>
        ) : (
          "Daftar"
        )}
      </Button>
    </form>
  );
}
