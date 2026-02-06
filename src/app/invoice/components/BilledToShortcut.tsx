"use client";

import React from "react";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BilledToShortcut = () => {
  const router = useRouter();
  const { billedToList, selectBilledTo, resetInvoice, setCurrentStep } =
    useInvoiceStore();

  const handleBilledToClick = (index: number) => {
    // 1. Reset invoice to start fresh
    resetInvoice();
    // 2. Select the Billed To recipient
    selectBilledTo(index);
    // 3. Set step to 2 (Billed)
    setCurrentStep(2);
    // 4. Navigate to create invoice page
    router.push("/invoice/create");
  };

  if (!billedToList || billedToList.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <Card className="border-none shadow-soft bg-white backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground/70 flex items-center gap-2">
              <Users className="w-4 h-4" /> Tagih Siapa? 🤔
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-hide">
            {/* Create New Shortcut */}
            <div className="snap-center shrink-0">
              <button
                onClick={() => {
                  resetInvoice();
                  setCurrentStep(2);
                  router.push("/invoice/create");
                }}
                className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-primary/20 bg-white/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <span className="text-[10px] font-bold text-primary">Baru</span>
              </button>
            </div>

            {/* Saved Billed To Shortcuts */}
            {billedToList.map((billedTo, index) => (
              <div key={billedTo.id} className="snap-center shrink-0">
                <Card
                  className="w-[140px] h-[100px] border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group active:scale-95 relative overflow-hidden bg-white"
                  onClick={() => handleBilledToClick(index)}
                >
                  <CardContent className="p-3 flex flex-col justify-between h-full relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white">
                        {billedTo.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground line-clamp-1">
                        {billedTo.name}
                      </h4>
                      <p className="text-[9px] text-muted-foreground line-clamp-1">
                        {billedTo.address ||
                          billedTo.email ||
                          billedTo.phone ||
                          "No details"}
                      </p>
                    </div>
                  </CardContent>
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
