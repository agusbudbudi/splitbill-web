"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import {
  Plus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ReceiptText,
  Sparkles,
  Wallet,
  History as HistoryIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatToIDR } from "@/lib/utils/invoice";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { ActionCard } from "@/components/ui/ActionCard";
import { TextButton } from "@/components/ui/TextButton";
import { BilledToShortcut } from "./BilledToShortcut";

export const InvoiceLanding = () => {
  const { invoiceHistory, currentInvoice } = useInvoiceStore();
  const hasItems = (currentInvoice.items?.length || 0) > 0;

  const stats = [
    {
      label: "Total Invoice",
      value: `${invoiceHistory.length} Invoice`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Nilai Total",
      value: formatToIDR(
        invoiceHistory.reduce((sum, inv) => sum + (inv.total || 0), 0),
      ),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const recentInvoices = [...invoiceHistory].reverse().slice(0, 2);

  return (
    <div className="space-y-5">
      {/* Hero CTA Card */}
      <FeatureBanner
        title="Kelola Invoice No Ribet. 🎉"
        description={
          <>
            Buat invoice profesional dalam sekejap. <br />
            <span className="font-bold text-primary">Mudah, cepat & rapi.</span>
          </>
        }
        ctaText={hasItems ? "Lanjutkan Buat Invoice" : "Buat Invoice Baru"}
        ctaHref="/invoice/create"
        illustration="/img/feature-invoice.png"
        variant="secondary"
      />
      {/* Stats Highlight Card */}
      <Card className="border-none bg-linear-to-br from-primary/5 via-primary/10 to-indigo-500/10 shadow-soft overflow-hidden relative group">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                  Total Invoice
                </p>
              </div>
              <p className="text-xl font-black text-foreground tracking-tight">
                {invoiceHistory.length}{" "}
                <span className="text-xs font-bold text-muted-foreground ml-1">
                  Invoice
                </span>
              </p>
            </div>

            <div className="w-px h-10 bg-primary/10" />

            <div className="flex-1 space-y-1 text-right">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                  Nilai Total
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-xl font-black text-foreground tracking-tight">
                {formatToIDR(
                  invoiceHistory.reduce(
                    (sum, inv) => sum + (inv.total || 0),
                    0,
                  ),
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Recent Activity / History Preview */}
      {invoiceHistory.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Invoice Terbaru
            </h3>
            <Link href="/history?tab=invoice">
              <TextButton
                label="Lihat Semua"
                icon={ArrowUpRight}
                iconPlacement="right"
                className="-mr-2"
              />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInvoices.map((inv, idx) => (
              <Link key={idx} href={`/history/invoice/${inv.id}`}>
                <Card className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-stretch justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">
                          {inv.invoiceNo}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Ke: {inv.billedTo?.name || "N/A"}
                        </p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1 opacity-60">
                            <Clock className="w-2.5 h-2.5" />
                            <p className="text-[9px] font-medium">
                              {inv.createdAt
                                ? new Date(inv.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className={cn(
                                "w-1 h-1 rounded-full",
                                inv.status === "paid"
                                  ? "bg-green-500"
                                  : "bg-orange-500",
                              )}
                            />
                            <span
                              className={cn(
                                "text-[9px] font-bold uppercase",
                                inv.status === "paid"
                                  ? "text-green-500"
                                  : "text-orange-500",
                              )}
                            >
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-between py-0.5">
                      <p className="text-xs font-black text-foreground">
                        {formatToIDR(inv.total || 0)}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-primary">
                          Lihat Detail
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Billed To Shortcuts */}
      <BilledToShortcut />

      {/* Feature Highlights Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h2 className="text-sm font-bold text-foreground/70">
            Fitur Unggulan ✨
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            title="Branding Pro"
            description="Pasang logo & identitas bisnismu."
            icon={Sparkles}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <ActionCard
            title="Export PDF"
            description="Share invoice rapi dalam sekejap."
            icon={FileText}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <ActionCard
            title="Pembayaran"
            description="Detail rekening lengkap & jelas."
            icon={Wallet}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <ActionCard
            title="Riwayat"
            description="Pantau semua tagihan di satu tempat."
            icon={HistoryIcon}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>
      </section>
    </div>
  );
};
