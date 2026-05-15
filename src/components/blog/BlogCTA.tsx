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
      color: "bg-orange-50 text-orange-600",
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
    <section className="w-full max-w-[600px] mx-auto bg-muted/20 py-12 px-8 rounded-t-lg">
      <div className=" mx-auto text-left">
        <h2 className="text-2xl font-black text-primary leading-tight mb-2">
          3 Langkah Mudah Bagi Tagihan <br />
          <span className="text-foreground">#PakeSplitBill</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-10">
          Urus patungan jadi lebih cepat, adil, dan transparan.
        </p>

        <div className="space-y-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base leading-none">
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

        <Link href="/split-bill">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-glow flex items-center justify-center gap-2 group transition-all"
          >
            Coba Split Bill Sekarang
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
};
