// Validation utilities

export function validateEmail(email: string): boolean {
  if (!email) return false;

  // 1. Strict regex for general shape
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const localPart = parts[0].toLowerCase();
  const domainPart = parts[1].toLowerCase();

  const domainSegments = domainPart.split('.');
  const domainName = domainSegments[0];

  // 2. Block if local part is identical to domain name (e.g. mario@mario.io, admin@admin.com)
  if (localPart === domainName) {
    return false;
  }

  // 3. Block keyboard smash or repeating characters for domain name (e.g. mmm.jj, aaa.com)
  if (/^(.)\1+$/.test(domainName)) {
    return false;
  }

  // 4. Block domains without any vowels if length > 2 (catches mmm.jj)
  if (!/[aeiouy]/i.test(domainName) && domainName.length > 2) {
    return false;
  }

  // 5. Explicitly block specific testing domains
  const blockedDomains = ['example.com', 'test.com', 'mmm.jj'];
  if (blockedDomains.includes(domainPart)) {
    return false;
  }

  return true;
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
    length: password.length >= 8,
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
