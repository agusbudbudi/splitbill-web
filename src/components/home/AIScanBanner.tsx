"use client";

import React from "react";
import { FeatureBanner } from "@/components/ui/FeatureBanner";

export const AIScanBanner = () => {
  return (
    <FeatureBanner
      title="Foto Struk, Semua Langsung Kebagi ✨"
      description={
        <>
          Cukup upload foto struk, <br />
          <span className="font-bold text-primary">
            sisanya biar AI yang urus.
          </span>
        </>
      }
      ctaText="Coba AI Scan"
      ctaHref="/split-bill?step=2"
      illustration="/img/feature-splitbill-scan.png"
      illustrationAlt="Ilustrasi Scan Struk AI — Foto struk belanja untuk bagi tagihan otomatis"
      variant="secondary"
    />
  );
};
