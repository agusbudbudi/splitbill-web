"use client";

import { PromoBanner } from "@/components/ui/PromoBanner";
import { trackLiburanLP } from "@/lib/gtag";

export function PenutupPromoBanner() {
  return (
    <PromoBanner
      href="/split-later"
      image="/img/promoBanner-split-later-new.jpg"
      imageAlt="Squad liburan di bandara, siap split struk yang udah dikumpulin"
      titleText="Liburan Beres."
      titleHighlight="Split-nya Cuma 5 Menit!"
      description="Gak perlu ribet itung-itung di tempat. Kumpulin struk dulu, bagi tagihannya belakangan."
      compactDescription="Kumpulin struk dulu, split belakangan."
      ctaText="Mulai Kumpulin Struk"
      onClick={() => trackLiburanLP.ctaClick("penutup")}
      rounded={false}
      contentPaddingClassName="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 min-h-[220px] lg:min-h-[280px]"
    />
  );
}
