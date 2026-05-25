import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/wallet", "/history"];

// Auth routes that should redirect to home if already logged in
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies or check if they exist
  // Note: In client-side app, we use localStorage, but middleware runs on server
  // So we'll check for a custom header or cookie if you set one
  // For now, we'll let the client-side handle redirects

  // This is a basic implementation - you may want to enhance this
  // by setting cookies on login/register for server-side checks

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Hanya jalankan middleware pada route yang membutuhkan pengecekan autentikasi
     * untuk mengurangi penggunaan Edge Requests di Vercel.
     */
    "/profile/:path*",
    "/wallet/:path*",
    "/history/:path*",
    "/split-bill/:path*",
  ],
};
