"use client";

import { useEffect, useState } from "react";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

// Shown only once hydrated (client-side navigations). On the first server
// response it renders nothing, so crawlers never get a full-screen
// "Memuat..." shell in place of the page content.
export default function Loading() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingIndicator text="Memuat..." />
    </div>
  );
}
