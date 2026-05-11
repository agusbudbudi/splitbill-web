"use client";

import React from "react";
import { FeatureBanner } from "@/components/ui/FeatureBanner";

export const AIScanBanner = () => {
  return (
    <FeatureBanner
      title="Split Bill dari Foto Struk"
      description={
        <>
          Cukup upload foto struk, <br />
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
