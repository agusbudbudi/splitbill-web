"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { HistoryTab } from "@/components/wallet/HistoryTab";
import { trackGeneral } from "@/lib/gtag";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

export default function HistoryPage() {
  const router = useRouter();

  React.useEffect(() => {
    trackGeneral.viewHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header
          title="Aktivitas"
          showBackButton
        />

        {/* Content */}
        <div className="flex-1 p-4">
          <React.Suspense
            fallback={
              <div className="h-40 flex items-center justify-center">
                <LoadingIndicator text="Memuat..." />
              </div>
            }
          >
            <HistoryTab />
          </React.Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
}
