"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MemberSidebar } from "./MemberSidebar";
import { markInternalNavigation } from "@/lib/utils/navigationHistory";

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export const ResponsiveShell = ({ children }: ResponsiveShellProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const isFirstRender = useRef(true);
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track whether the user has navigated client-side within the app at
  // least once — lets pages that can be deep-linked to (e.g. detail pages)
  // fall back to a sensible list route instead of a no-op router.back()
  // when opened directly via URL.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    markInternalNavigation(lastPathnameRef.current);
    lastPathnameRef.current = pathname;
  }, [pathname]);

  const isBlogDetail = pathname.startsWith("/blog/") && pathname.split("/").length > 2;
  const isAuthPage = ["/login", "/register", "/verify"].some(path => pathname.startsWith(path));
  const isMemberShell = pathname.startsWith("/member/") || pathname === "/member";

  return (
    <div className="w-full min-h-screen bg-background">
      {isMounted && pathname !== "/" && !isBlogDetail && !isAuthPage && !isMemberShell && <MemberSidebar />}
      {children}
    </div>
  );
};
