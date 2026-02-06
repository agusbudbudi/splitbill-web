export const API_BASE_URL = "https://splitbillbe.netlify.app";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
  },
  REVIEWS: "/api/reviews",
} as const;
