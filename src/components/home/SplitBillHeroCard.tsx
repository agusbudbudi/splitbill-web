"use client";

import React from "react";
import { Camera, Sparkles, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { HeroBanner } from "@/components/ui/HeroBanner";

const HeroFloatingCard = () => (
  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-3.5 border border-slate-100/60 min-w-[150px]">
    <p className="text-[10px] text-slate-500 font-medium mb-0.5">
      Total Tagihan
    </p>
    <p className="text-[15px] font-black text-slate-900 mb-3 tracking-tight">
      Rp 842.500
    </p>

    <div className="w-full h-px bg-slate-100 mb-3" />

    <p className="text-[10px] text-slate-500 font-medium mb-0.5">
      Dibagi ke 4 orang
    </p>
    <p className="text-[13px] font-black text-slate-900 mb-3 tracking-tight">
      Rp 210.625{" "}
      <span className="text-[10px] text-slate-400 font-medium ml-0.5">
        / orang
      </span>
    </p>

    <div className="flex items-center justify-between mt-1">
      <div className="flex -space-x-1.5">
        {["Budi", "Siti", "Andi"].map((name, i) => (
          <div
            key={i}
            className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white overflow-hidden bg-slate-100 shadow-sm"
          >
            <img
              src={`https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${name}`}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
        <Check className="w-3 h-3" strokeWidth={3.5} />
      </div>
    </div>
  </div>
);

export const SplitBillHeroCard = () => {
  const router = useRouter();

  return (
    <HeroBanner
      variant="light"
      className="w-full bg-white border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      badgeText="Scan Struk Otomatis"
      badgeIcon={<Sparkles className="w-3 h-3 text-primary fill-primary" />}
      title={
        <>
          Split Bill <br />
          <span className="text-primary font-extrabold">Tanpa Ribet</span>
        </>
      }
      description="Tinggal foto struk, biar AI yang urus hitungannya. Langsung Beres!"
      primaryButtonText="Mulai Scan"
      primaryButtonIcon={<Camera className="w-5 h-5" />}
      onPrimaryClick={() => router.push("/split-bill?step=1")}
      imageSrc="/img/hero-splitbill.png"
      floatingCard={<HeroFloatingCard />}
      trustText="Andalan ribuan grup & trip! 🔥"
    />
  );
};
