"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { ReviewForm } from "@/components/review/ReviewForm";
import Image from "next/image";

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Review" showBackButton />

      <main className="w-full max-w-[480px] pb-40">
        {/* Banner Section */}
        <div className="w-full px-4 pt-4">
          <div className="relative aspect-[360/113] w-full overflow-hidden rounded-lg">
            <Image
              src="/img/banner-feedback.jpg"
              alt="Feedback Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="px-4 mt-6 space-y-6">
          {/* Form Section */}
          <ReviewForm />
        </div>
      </main>
    </div>
  );
}
