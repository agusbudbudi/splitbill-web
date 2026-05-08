"use client";

import React from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { AIScanQuotaBanner } from "@/components/ui/AIScanQuotaBanner";

export const AIScanEncourageBanner = () => {
  const { user } = useAuthStore();
  const isSubscribed = user?.subscriptionStatus === "active";
  const freeScanCount = user?.freeScanCount ?? 5;

  return (
    <AIScanQuotaBanner 
      freeScanCount={freeScanCount} 
      isSubscribed={isSubscribed}
      showRedirect={true} 
    />
  );
};
