export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    VERIFY: "/api/auth/verify",
    RESEND_VERIFICATION: "/api/auth/resend-verification",
  },
  REVIEWS: "/api/reviews",
  GEMINI_SCAN: "/api/gemini-scan",
} as const;
