"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { formatToIDR } from "@/lib/utils/invoice";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  FileText,
  User,
  CreditCard,
  ChevronLeft,
  Download,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { downloadInvoicePDF } from "@/lib/utils/pdfGenerator";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { invoiceHistory } = useInvoiceStore();
  const id = params.id as string;
  const [isDownloading, setIsDownloading] = useState(false);

  const invoice = invoiceHistory.find((inv) => inv.id === id);

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      setIsDownloading(true);
      const fileName = `Invoice-${invoice.invoiceNo || "Draft"}.pdf`;
      await downloadInvoicePDF(invoice, fileName);
      toast.success("Invoice berhasil didownload!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold">Invoice tidak ditemukan</h1>
        <Button
          onClick={() => router.push("/history")}
          className="mt-4"
          variant="outline"
        >
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header
          title="Detail Invoice"
          showBackButton
          onBack={() => router.push("/history?tab=invoice")}
        />

        <main className="flex-1 p-4 pb-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Info Card */}
          <Card className="border-none shadow-soft overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              <div className="bg-[#f0f4ff] p-8 text-foreground text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 blur-xl" />

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-md font-black tracking-tight text-foreground/80 uppercase">
                      {invoice.invoiceNo}
                    </h2>
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-white rounded-full border border-primary/10">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Due:{" "}
                        {new Date(invoice.dueDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                      Total Tagihan
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-primary">
                      {formatToIDR(invoice.total)}
                    </p>

                    {/* Relocated Status */}
                    <div className="mt-4 flex justify-center">
                      <div
                        className={cn(
                          "px-4 py-1.5 rounded-full flex items-center gap-2 border",
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200",
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {invoice.status === "paid"
                            ? "Lunas"
                            : "Belum Dibayar"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8 bg-white/50 backdrop-blur-sm">
                {/* Billed Info Grid */}
                <div className="grid grid-cols-2 gap-8 relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted/30 -translate-x-1/2 hidden sm:block" />

                  {/* Pengirim Tagihan (Billed By) - Left */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Pengirim Tagihan
                      </p>
                    </div>
                    <div className="pl-7 space-y-1">
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {invoice.billedBy?.name}
                      </p>
                      {invoice.billedBy?.phone && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedBy.phone}
                        </p>
                      )}
                      {invoice.billedBy?.email && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedBy.email}
                        </p>
                      )}
                      {invoice.billedBy?.address && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedBy.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Penerima Tagihan (Billed To) - Right */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Penerima Tagihan
                      </p>
                    </div>
                    <div className="pl-7 space-y-1">
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {invoice.billedTo?.name}
                      </p>
                      {invoice.billedTo?.phone && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedTo.phone}
                        </p>
                      )}
                      {invoice.billedTo?.email && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedTo.email}
                        </p>
                      )}
                      {invoice.billedTo?.address && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {invoice.billedTo.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-muted/50 pb-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Rincian Item
                    </p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Total
                    </p>
                  </div>
                  <div className="space-y-3">
                    {invoice.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start group transition-all"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                              {item.qty}x
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatToIDR(item.rate)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-black text-foreground">
                          {formatToIDR(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Section */}
                <div className="pt-6 border-t border-muted-foreground/10 space-y-3 bg-muted/5 -mx-6 px-6 pb-2">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/70">
                    <span>Subtotal</span>
                    <span>{formatToIDR(invoice.subtotal)}</span>
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-xs font-bold text-green-600">
                      <span>Diskon</span>
                      <span>-{formatToIDR(invoice.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Grand Total
                    </span>
                    <span className="text-xl font-black text-primary tracking-tighter">
                      {formatToIDR(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.paymentMethods && invoice.paymentMethods.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Metode Pembayaran
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {invoice.paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    className="relative p-3 rounded-lg border border-primary/10 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-muted/30 flex items-center justify-center p-1.5 overflow-hidden">
                        {method.logo &&
                        method.logo !== "/img/wallet-icon.png" ? (
                          <img
                            src={method.logo}
                            alt={method.bankName || method.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {(method.bankName || method.name)
                              .substring(0, 3)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">
                          {method.bankName || method.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
                          {method.name} • {method.accountNumber || method.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full h-14 font-black rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all text-base tracking-tight active:scale-[0.98]"
          >
            <Download className="w-5 h-5 mr-3" />
            {isDownloading ? "Downloading..." : "Download Invoice (PDF)"}
          </Button>
        </main>

        <Footer />
      </div>
    </div>
  );
}
