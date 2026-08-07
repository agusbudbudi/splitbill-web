"use client";

import { Suspense } from "react";
import { SplitLaterPanel } from "@/components/split-later/SplitLaterPanel";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";

export default function MemberSplitLaterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[600px] mx-auto flex items-center justify-center py-20">
          <LoadingIndicator />
        </div>
      }
    >
      <SplitLaterPanel />
    </Suspense>
  );
}
