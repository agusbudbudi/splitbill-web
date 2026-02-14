"use client";

import React from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { AIScanQuotaBanner } from "@/components/ui/AIScanQuotaBanner";

export const AIScanEncourageBanner = () => {
  const { user } = useAuthStore();
  const freeScanCount = user?.freeScanCount ?? 10;

  return (
    <AIScanQuotaBanner 
      freeScanCount={freeScanCount} 
      showRedirect={true} 
    />
  );
};
