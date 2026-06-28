import React from "react";
import Image from "next/image";

export const AIScanBenefits = () => (
  <div className="flex gap-3 items-start p-4 bg-primary/5 rounded-lg transition-all hover:bg-primary/[0.07]">
    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
      <Image
        src="/img/icon-ai-info.png"
        alt="AI Scan"
        width={40}
        height={40}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
    <div>
      <p className="text-sm font-bold text-primary">Kelebihan Scan AI</p>
      <p className="text-[11px] leading-relaxed mt-0.5 text-muted-foreground font-medium">
        Otomatis deteksi item, harga, dan pajak tanpa perlu ketik manual
        satu-satu. Hemat waktu & tenaga! ⚡
      </p>
    </div>
  </div>
);
