"use client";

import { MemberHomeContent } from "@/components/member/MemberHomeContent";
import { MerchandisingBanner } from "@/components/ui/MerchandisingBanner";

export default function MemberV2HomePage() {
  return (
    <>
      <MerchandisingBanner
        imageSrc="/img/banner-merchandising.png"
        altText="Promo Spesial SplitBill Premium — Nikmati fitur eksklusif sekarang"
      />
      <MemberHomeContent singleColumn />
    </>
  );
}
