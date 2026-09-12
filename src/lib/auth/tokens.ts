// Token management utilities

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Non-httpOnly cookie mirroring the refresh token, read only by
// middleware.ts to redirect logged-out visitors before a protected page
// renders. It is NOT the security boundary — every API call still verifies
// the Authorization bearer token (from localStorage) server-side.
export const SESSION_COOKIE_NAME = "sb_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days, mirrors refresh token TTL

function setSessionCookie(refreshToken: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE_NAME}=${refreshToken}; Path=/; Max-Age=${SESSION_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setSessionCookie(refreshToken);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearSessionCookie();
}

export function hasTokens(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}

// Set right before a hard redirect to /login after a real API call rejected
// the token (see client.ts handleTokenExpired). authStore.initialize() reads
// and clears it on the next /login load to skip the silent Google-session
// auto-relogin — otherwise a stale, never-refreshed Google idToken cached in
// NextAuth's own (longer-lived) session cookie keeps re-minting app tokens
// that the backend rejects on the very next request, looping forever.
const AUTH_EXPIRED_GUARD_KEY = "sb_auth_expired_guard";

export function markAuthExpired(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AUTH_EXPIRED_GUARD_KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode, etc) — guard is best-effort
  }
}

export function consumeAuthExpiredGuard(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const wasSet = sessionStorage.getItem(AUTH_EXPIRED_GUARD_KEY) === "1";
    sessionStorage.removeItem(AUTH_EXPIRED_GUARD_KEY);
    return wasSet;
  } catch {
    return false;
  }
}
