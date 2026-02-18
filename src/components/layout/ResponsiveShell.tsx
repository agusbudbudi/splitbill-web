"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export const ResponsiveShell = ({ children }: ResponsiveShellProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      className="flex h-dvh w-full bg-background overflow-hidden"
      suppressHydrationWarning
    >
      <Sidebar />

      {/* Main Content Area */}
      <main 
        id="main-scroll-container" 
        className="flex-1 w-full flex flex-col h-full relative overflow-y-auto"
        suppressHydrationWarning
      >
        <div className="flex-1 flex flex-col w-full relative">
          {children}
        </div>
      </main>
    </div>
  );
};
