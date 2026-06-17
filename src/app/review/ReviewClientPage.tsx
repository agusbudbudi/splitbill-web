"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewForm } from "@/components/review/ReviewForm";
import Image from "next/image";

export default function ReviewClientPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header title="Review" showBackButton />

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary via-primary/50 to-transparent pointer-events-none z-0" />

        <main className="relative z-10 flex-1 w-full flex flex-col">
          {/* Banner Section */}
          <div className="w-full px-4 pt-4">
            <div className="relative aspect-[360/113] w-full overflow-hidden rounded-lg">
              <Image
                src="/img/banner-feedback.jpg"
                alt="Berikan Review dan Masukan untuk Aplikasi SplitBill Online — Masukanmu sangat berarti bagi kami"
                fill
                sizes="(max-width: 600px) 100vw, 600px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="px-4 mt-4 flex-1 flex flex-col">
            {/* Form Section */}
            <ReviewForm />
          </div>
        </main>
      </div>
    </div>
  );
}
