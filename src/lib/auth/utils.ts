// Validation utilities

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export interface PasswordValidation {
  isValid: boolean;
  strength: number;
  checks: {
    length: boolean;
    hasNumber: boolean;
    hasLetter: boolean;
  };
}

export function validatePassword(password: string): PasswordValidation {
  const checks = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };

  return {
    isValid: checks.length && (checks.hasNumber || checks.hasLetter),
    strength: Object.values(checks).filter(Boolean).length,
    checks,
  };
}

export function getPasswordStrength(
  password: string,
): "weak" | "medium" | "strong" {
  const validation = validatePassword(password);

  if (validation.strength === 1) return "weak";
  if (validation.strength === 2) return "medium";
  return "strong";
}

export function getPasswordStrengthLabel(
  strength: "weak" | "medium" | "strong",
): string {
  const labels = {
    weak: "Lemah",
    medium: "Sedang",
    strong: "Kuat",
  };
  return labels[strength];
}

export function getPasswordStrengthColor(
  strength: "weak" | "medium" | "strong",
): string {
  const colors = {
    weak: "#dc2626",
    medium: "#f59e0b",
    strong: "#16a34a",
  };
  return colors[strength];
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
}

export function getErrorMessage(error: Error | unknown): string {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  if (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("invalid credentials")
  ) {
    return "Email atau password salah";
  } else if (
    message.includes("409") ||
    message.includes("conflict") ||
    message.includes("already exists")
  ) {
    return "Email sudah terdaftar";
  } else if (message.includes("400") || message.includes("bad request")) {
    return "Data yang dimasukkan tidak valid";
  } else if (message.includes("network") || message.includes("fetch")) {
    return "Koneksi bermasalah, coba lagi";
  } else if (message.includes("server") || message.includes("500")) {
    return "Server sedang bermasalah, coba lagi nanti";
  }

  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan, coba lagi";
}
