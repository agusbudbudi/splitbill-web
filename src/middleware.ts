import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/auth/tokens";

// Routes that require an active session. NOTE: /split-bill is intentionally
// NOT here — it supports a guest draft flow (see authStore.ts login() /
// draftId association) where an unauthenticated visitor can start a split
// bill and only needs to log in later to save it. Gating it here would break
// that flow.
const protectedRoutes = ["/wallet", "/history", "/split-later", "/member"];

// Auth routes that should redirect to home if already logged in
const authRoutes = ["/login", "/register"];

// The splitbill-native app renders these pages inside a WebView that injects
// valid tokens into localStorage (see AppWebView.tsx), not into the cookie
// jar — so it never carries sb_session on its first request to a given URL.
// Its own onNavigationStateChange watchdog treats any bounce to /login as a
// real logout and signs the user out natively, so gating it here on the
// (missing) cookie would log out every native user on their first visit to
// a protected page each session. Skip the redirect for that surface and let
// the existing client-side ProtectedRoute / page auth checks — which read
// the real injected tokens — keep gating it, same as before this change.
const NATIVE_WEBVIEW_UA_MARKER = "SplitBillNativeApp";

type SessionCheck = "valid" | "invalid" | "misconfigured";

async function checkSession(request: NextRequest): Promise<SessionCheck> {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    return "misconfigured";
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return "invalid";

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return "valid";
  } catch {
    return "invalid";
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isNativeWebview = request.headers
    .get("user-agent")
    ?.includes(NATIVE_WEBVIEW_UA_MARKER);
  if (isNativeWebview) {
    return NextResponse.next();
  }

  const session = await checkSession(request);

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Missing/misconfigured JWT_REFRESH_SECRET makes every visitor look
  // logged-out — surface it as a loud 500 instead of silently redirecting
  // to /login, which would look like a normal auth flow and hide a
  // deploy-config bug behind "the whole app is broken".
  if (isProtected && session === "misconfigured") {
    console.error(
      "middleware: JWT_REFRESH_SECRET is not configured — refusing to gate protected routes",
    );
    return new NextResponse("Server misconfigured (auth)", { status: 500 });
  }

  if (isProtected && session === "invalid") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  if (isAuthRoute && session === "valid") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Hanya jalankan middleware pada route yang membutuhkan pengecekan autentikasi
     * untuk mengurangi penggunaan Edge Requests di Vercel.
     */
    "/wallet/:path*",
    "/history/:path*",
    "/split-later/:path*",
    "/member/:path*",
    "/login",
    "/register",
  ],
};
