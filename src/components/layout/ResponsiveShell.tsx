"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MemberSidebar } from "./MemberSidebar";

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export const ResponsiveShell = ({ children }: ResponsiveShellProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isBlogDetail = pathname.startsWith("/blog/") && pathname.split("/").length > 2;
  const isAuthPage = ["/login", "/register", "/verify"].some(path => pathname.startsWith(path));

  return (
    <div className="w-full min-h-screen bg-background">
      {pathname !== "/" && !isBlogDetail && !isAuthPage && <MemberSidebar />}
      {children}
    </div>
  );
};
