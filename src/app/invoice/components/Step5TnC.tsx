"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";

export function Step5TnC() {
  const { currentInvoice, updateInvoice } = useInvoiceStore();

  return (
    <Card className="p-5">
      <div className="space-y-4">
        {/* Terms & Conditions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 tracking-tight">
            Add Terms & Conditions (Optional)
          </label>
          <RichTextEditor
            placeholder="Enter your terms and conditions here..."
            value={currentInvoice.tnc || ""}
            onChange={(value) => updateInvoice({ tnc: value })}
            className="min-h-[150px]"
          />
        </div>

        {/* Footer */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 tracking-tight">
            Add Footer (Optional)
          </label>
          <Input
            placeholder="Footer text (e.g., Thank you for your business)"
            value={currentInvoice.footer || ""}
            onChange={(e) => updateInvoice({ footer: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
