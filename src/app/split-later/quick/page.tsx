import type { Metadata } from "next";
import { Suspense } from "react";
import QuickCaptureClientPage from "./QuickCaptureClientPage";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "Foto Struk | Split Later | Split Bill App",
  description: "Foto struk sekarang, simpan ke Split Later, lanjutin itungannya kapan aja.",
};

export default function QuickCapturePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <LoadingIndicator />
          </div>
        }
      >
        <QuickCaptureClientPage />
      </Suspense>
    </ProtectedRoute>
  );
}
