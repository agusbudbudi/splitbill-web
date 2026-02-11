"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export const FAQCard = () => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/faq">
        <Card className="group relative overflow-hidden bg-white/50 backdrop-blur-sm border-1 border-white shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-foreground font-bold text-sm tracking-tight">
                    Ada Pertanyaan?
                  </h3>
                  <p className="text-muted-foreground text-[10px] font-medium">
                    Lihat FAQ atau Hubungi Support Kami
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
