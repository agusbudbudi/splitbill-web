import React from "react";
import { Scan, Users, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const BlogCTA = () => {
  const steps = [
    {
      icon: Scan,
      title: "Scan Struk Otomatis",
      description:
        "Foto struk belanjaanmu dan biarkan AI kami yang mendata itemnya secara otomatis.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "Pilih Teman & Item",
      description:
        "Tandai siapa saja yang ikut patungan dan pilih item yang mereka beli.",
      color: "bg-[#EEA420]/10 text-[#EEA420]",
    },
    {
      icon: Send,
      title: "Kirim Tagihan & Bayar",
      description:
        "Bagikan link tagihan ke teman-teman dan terima pembayaran langsung ke dompetmu.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="w-full max-w-[600px] lg:max-w-7xl mx-auto py-12 lg:py-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
        {/* Kolom 1: Title, Desc, and CTA (Lebih lebar dengan col-span-2) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col text-left lg:h-full lg:justify-between gap-6 lg:pr-8">
          <div className="space-y-3">
            <h2 className="text-2xl lg:text-3xl font-black text-primary leading-tight">
              3 Langkah Mudah Bagi Tagihan <br />
              <span className="text-foreground">#PakeSplitBill</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Urus patungan jadi lebih cepat, adil, dan transparan.
            </p>
          </div>
          <Link href="/split-bill" className="w-full cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full lg:max-w-xs bg-primary text-white font-bold py-3.5 px-6 rounded-2xl shadow-glow flex items-center justify-center gap-2 group transition-all cursor-pointer text-sm"
            >
              Coba Split Bill
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </div>

        {/* Kolom 2, 3, 4: Langkah-langkah (col-span-3) */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex lg:flex-col gap-4 lg:justify-start">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-left lg:mt-1">
                  <h3 className="font-bold text-foreground text-base leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
