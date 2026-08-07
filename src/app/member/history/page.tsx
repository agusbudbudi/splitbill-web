"use client";

import React from "react";
import { HistoryTab } from "@/components/wallet/HistoryTab";
import { Skeleton } from "@/components/ui/Skeleton";
import { TransactionCardSkeleton } from "@/components/ui/TransactionCardSkeleton";
import { trackGeneral } from "@/lib/gtag";

function HistoryTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-6 border-b border-border/60 pb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="w-10 h-10 rounded-sm shrink-0" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <TransactionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function MemberV2HistoryPage() {
  React.useEffect(() => {
    trackGeneral.viewHistory();
  }, []);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <React.Suspense fallback={<HistoryTabSkeleton />}>
        <HistoryTab />
      </React.Suspense>
    </div>
  );
}
