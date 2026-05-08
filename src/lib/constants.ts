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
  PUBLIC_REVIEWS: "/api/reviews/public",
  GEMINI_SCAN: "/api/gemini-scan",
  SUBSCRIPTION_PACKAGES_PUBLIC: "/api/subscription-packages/public",
  ORDERS: {
    CREATE: "/api/orders/create",
    LIST: "/api/orders",
    BY_ID: (id: string) => `/api/orders/${id}`,
  },
} as const;
