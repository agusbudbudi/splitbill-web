"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export const FAQCard = ({ compact = false }: { compact?: boolean }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/faq">
        <Card className="group relative overflow-hidden bg-white border border-slate-100 shadow-soft hover:shadow-md transition-all duration-300 cursor-pointer rounded-2xl">
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">
                    Ada Pertanyaan?
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">
                    Lihat FAQ atau Hubungi Support Kami
                  </p>
                </div>
              </div>

              <div className="text-primary group-hover:translate-x-2 transition-transform">
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
