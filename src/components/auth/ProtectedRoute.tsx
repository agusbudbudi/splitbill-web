"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount (only runs once)
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Redirect to login if the initial auth check has actually finished and
    // came back unauthenticated. Gating on isInitialized (not just isLoading)
    // matters because both effects here fire in the same mount commit against
    // the same pre-initialize render (isLoading: false, isAuthenticated:
    // false, isInitialized: false) — without this, every first-ever render
    // reads as "not loading, not authenticated" and redirects before
    // initialize() gets a chance to read the real tokens.
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, pathname]);

  // Show loading state while checking auth
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingIndicator text="Memuat..." />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
