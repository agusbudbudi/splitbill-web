"use client";

import React from "react";
import { FeatureBanner } from "@/components/ui/FeatureBanner";

export const AIScanBanner = () => {
  return (
    <FeatureBanner
      title="Scan Bill dengan AI 🎉"
      description={
        <>
          Cukup upload bill kamu, <br />
          <span className="font-bold text-primary">
            sisanya biar AI yang urus.
          </span>
        </>
      }
      ctaText="Mulai Scan Bill"
      ctaHref="/split-bill?step=2"
      illustration="/img/feature-splitbill-scan.png"
      variant="secondary"
    />
  );
};
