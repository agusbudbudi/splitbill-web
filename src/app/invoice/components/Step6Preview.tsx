"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { formatToIDR, generateAvatarUrl } from "@/lib/utils/invoice";
import { FileCheck, Download, History, Home } from "lucide-react";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { toast } from "sonner";
import { downloadInvoicePDF } from "@/lib/utils/pdfGenerator";
import { useRouter } from "next/navigation";

export function Step6Preview() {
  const router = useRouter();
  const { currentInvoice } = useInvoiceStore();
  const [isDownloading, setIsDownloading] = useState(false);

  // Use status from store to determine if finalized
  const isFinalized = currentInvoice.status !== "draft";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const fileName = `Invoice-${currentInvoice.invoiceNo || "Draft"}.pdf`;
      await downloadInvoicePDF(currentInvoice, fileName);
      toast.success("Invoice berhasil didownload!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      {!isFinalized && (
        <Card className="p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🤩</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-foreground mb-0.5 tracking-tight">
                Yeay! Invoice kamu hampir siap
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Periksa invoice kamu dibawah ini. Pastikan semua item sudah
                diisi ya.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Invoice Preview */}
      <Card className="p-5" id="invoice-preview-container">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">
                Invoice
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Invoice No:{" "}
                <strong className="text-foreground">
                  {currentInvoice.invoiceNo}
                </strong>
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Invoice Date:{" "}
                <strong className="text-foreground">
                  {formatDate(currentInvoice.invoiceDate || "")}
                </strong>
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Due Date:{" "}
                <strong className="text-foreground">
                  {formatDate(currentInvoice.dueDate || "")}
                </strong>
              </p>
            </div>
            {currentInvoice.logo && (
              <div className="relative h-12 w-32">
                <Image
                  src={currentInvoice.logo}
                  alt="Logo"
                  fill
                  className="object-contain object-right"
                  unoptimized={currentInvoice.logo.startsWith("data:")}
                />
              </div>
            )}
          </div>

          {/* Billed By/To */}
          <div className="grid grid-cols-2 gap-4">
            {currentInvoice.billedBy && (
              <div className="p-3 bg-primary/5 rounded-lg">
                <h3 className="font-bold text-xs text-foreground/70 mb-2 tracking-tight">
                  Billed By
                </h3>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-sm overflow-hidden bg-white border border-primary/10 flex-shrink-0">
                    <img
                      src={
                        currentInvoice.billedBy.avatar ||
                        generateAvatarUrl(currentInvoice.billedBy.name)
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden flex flex-col justify-center">
                    <p className="font-bold text-sm text-foreground tracking-tight truncate">
                      {currentInvoice.billedBy.name}
                    </p>
                    {currentInvoice.billedBy.phone && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedBy.phone}
                      </p>
                    )}
                    {currentInvoice.billedBy.email && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedBy.email}
                      </p>
                    )}
                    {currentInvoice.billedBy.address && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedBy.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {currentInvoice.billedTo && (
              <div className="p-3 bg-primary/5 rounded-lg">
                <h3 className="font-bold text-xs text-foreground/70 mb-2 tracking-tight">
                  Billed To
                </h3>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-sm overflow-hidden bg-white border border-primary/10 flex-shrink-0">
                    <img
                      src={
                        currentInvoice.billedTo.avatar ||
                        generateAvatarUrl(currentInvoice.billedTo.name)
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden flex flex-col justify-center">
                    <p className="font-bold text-sm text-foreground tracking-tight truncate">
                      {currentInvoice.billedTo.name}
                    </p>
                    {currentInvoice.billedTo.phone && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedTo.phone}
                      </p>
                    )}
                    {currentInvoice.billedTo.email && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedTo.email}
                      </p>
                    )}
                    {currentInvoice.billedTo.address && (
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {currentInvoice.billedTo.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-sm border border-primary/20">
            <table className="w-full">
              <thead className="bg-primary/5">
                <tr className="border-b border-primary/20">
                  <th className="text-left py-2.5 px-3 text-xs font-bold text-foreground tracking-tight">
                    Item Name
                  </th>
                  <th className="text-center py-2.5 px-2 text-xs font-bold text-foreground tracking-tight">
                    Qty
                  </th>
                  <th className="text-right py-2.5 px-2 text-xs font-bold text-foreground tracking-tight">
                    Rate
                  </th>
                  <th className="text-right py-2.5 px-3 text-xs font-bold text-foreground tracking-tight">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {currentInvoice.items?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-xs text-foreground tracking-tight">
                        {item.name}
                      </div>
                      {item.description && (
                        <div
                          className="text-[11px] text-muted-foreground mt-0.5 font-medium prose prose-sm max-w-none [&>p]:mb-0.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      )}
                    </td>
                    <td className="text-center py-2.5 px-2 text-xs text-muted-foreground font-medium">
                      {item.qty}
                    </td>
                    <td className="text-right py-2.5 px-2 text-xs text-muted-foreground font-medium">
                      {formatToIDR(item.rate)}
                    </td>
                    <td className="text-right py-2.5 px-3 font-bold text-xs text-foreground">
                      {formatToIDR(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-56 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Sub Total:
                </span>
                <span className="font-bold text-foreground">
                  {formatToIDR(currentInvoice.subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Discount:
                </span>
                <span className="font-bold text-destructive">
                  - {formatToIDR(currentInvoice.discountAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-muted">
                <span className="text-foreground">Total (IDR):</span>
                <span className="text-primary">
                  {formatToIDR(currentInvoice.total || 0)}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-right font-medium">
                {currentInvoice.totalInWords}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          {currentInvoice.paymentMethods &&
            currentInvoice.paymentMethods.length > 0 && (
              <div className="pt-4 border-t border-muted">
                <h3 className="font-bold text-xs text-foreground/70 mb-2 tracking-tight">
                  Payment Methods
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentInvoice.paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-2.5 bg-muted/30 rounded-sm flex items-center gap-4"
                    >
                      {/* Logo or Placeholder */}
                      <div className="w-12 h-12 rounded bg-white flex-shrink-0 flex items-center justify-center p-1 relative overflow-hidden">
                        {method.logo &&
                        method.logo !== "/img/wallet-icon.png" ? (
                          <Image
                            src={method.logo}
                            alt={method.bankName || method.name || "Payment Method"}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-muted-foreground">
                            {(method.bankName || method.name)
                              .substring(0, 3)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground tracking-tight">
                          {method.bankName || method.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {method.type === "bank"
                            ? method.accountNumber
                            : method.phone}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          a.n. {method.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Terms & Conditions */}
          {currentInvoice.tnc && (
            <div className="pt-4 border-t border-muted">
              <h3 className="font-bold text-xs text-foreground/70 mb-1.5 tracking-tight">
                Terms and Conditions
              </h3>
              <div
                className="text-xs text-muted-foreground font-medium prose prose-sm max-w-none [&>p]:mb-0.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                dangerouslySetInnerHTML={{ __html: currentInvoice.tnc }}
              />
            </div>
          )}

          {/* Footer */}
          {currentInvoice.footer && (
            <div className="text-center text-xs text-muted-foreground pt-3 font-medium">
              {currentInvoice.footer}
            </div>
          )}
        </div>
      </Card>

      {/* Primary Download Button - Visible Before Finalization */}
      {!isFinalized && (
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          variant="outline"
          className="w-full h-12 border-primary/20 text-primary hover:text-primary hover:bg-primary/5"
        >
          {isDownloading ? (
            "Downloading..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Preview
            </>
          )}
        </Button>
      )}

      {/* Success State (Visible if finalized) */}
      {isFinalized && (
        <SuccessSection
          title="Invoice Berhasil Disimpan! 🎉"
          subtitle="Invoice kamu sudah tersimpan di history dan siap untuk digunakan."
          icon={FileCheck}
          actions={[
            {
              label: "Lihat History",
              onClick: () => router.push("/history?tab=invoice"),
              variant: "outline",
              icon: History,
            },
            {
              label: "Download PDF",
              onClick: handleDownloadPDF,
              variant: "default",
              icon: Download,
            },
          ]}
        />
      )}
    </div>
  );
}
