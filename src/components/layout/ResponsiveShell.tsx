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

  return (
    <div className="w-full min-h-screen bg-background">
      {pathname !== "/" && <MemberSidebar />}
      {children}
    </div>
  );
};
