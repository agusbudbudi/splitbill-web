import type { Metadata } from "next";
import { Suspense } from "react";
import SplitLaterClientPage from "./SplitLaterClientPage";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "Split Later | Split Bill App",
  description:
    "Kumpulkan foto struk saat liburan atau acara, lalu split belakangan dengan mudah. Fitur Split Later dari Split Bill App.",
  alternates: {
    canonical: "https://www.splitbill.my.id/split-later",
  },
};

export default function SplitLaterPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <LoadingIndicator />
        </div>
      }>
        <SplitLaterClientPage />
      </Suspense>
    </ProtectedRoute>
  );
}
