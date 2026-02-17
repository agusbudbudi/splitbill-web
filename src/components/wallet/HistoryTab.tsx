"use client";

import React from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { formatToIDR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ChevronRight,
  ScrollText,
  Plus,
  FileText,
  ReceiptText,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useTransactionFilter } from "@/hooks/useTransactionFilter";
import { TransactionFilterBottomSheet } from "@/components/history/TransactionFilterBottomSheet";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const HistoryTab = () => {
  const { savedBills } = useWalletStore();
  const { invoiceHistory } = useInvoiceStore();
  const searchParams = useSearchParams();
  const defaultTab =
    (searchParams.get("tab") as "split-bill" | "invoice") || "split-bill";
  const [activeTab, setActiveTab] = React.useState<"split-bill" | "invoice">(
    defaultTab,
  );

  const tabs = [
    { id: "split-bill", label: "Split Bill", icon: ReceiptText },
    { id: "invoice", label: "Invoice", icon: FileText },
  ] as const;

  type TabId = (typeof tabs)[number]["id"];

  // Calculate default 30 days filter (using local time)
  const last30DaysFilter = React.useMemo(() => {
    const toLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
      dateFrom: toLocalDateString(thirtyDaysAgo),
      dateTo: toLocalDateString(today),
    };
  }, []);

  // Filter for Split Bill
  const splitBillFilter = useTransactionFilter({
    data: savedBills,
    getDate: (bill) => bill.date,
    initialFilters: last30DaysFilter,
  });

  // Filter for Invoice
  const invoiceFilter = useTransactionFilter({
    data: invoiceHistory,
    getDate: (invoice) => invoice.createdAt,
    initialFilters: last30DaysFilter,
  });

  // Get current filter based on active tab
  const currentFilter =
    activeTab === "split-bill" ? splitBillFilter : invoiceFilter;

  const renderEmptyState = ({ type }: { type: "split-bill" | "invoice" }) => {
    if (type === "split-bill") {
      return (
        <EmptyState
          icon={ScrollText}
          message="Belum Ada Transaksi"
          subtitle="Riwayat split bill kamu akan muncul di sini setelah kamu menyelesaikan transaksi pertamamu."
          action={
            <Link href="/split-bill">
              <Button className="rounded-lg px-10 shadow-lg shadow-primary/20 font-bold h-12">
                <Plus className="w-5 h-5 mr-2" /> Buat Split Bill
              </Button>
            </Link>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={FileText}
        message="Belum Ada Invoice"
        subtitle="Riwayat invoice kamu akan muncul di sini setelah kamu memfinalisasi invoice pertamamu."
        action={
          <Link href="/invoice/create">
            <Button className="rounded-lg px-10 shadow-lg shadow-primary/20 font-bold h-12">
              <Plus className="w-5 h-5 mr-2" /> Buat Invoice
            </Button>
          </Link>
        }
      />
    );
  };

  const renderFilteredEmptyState = () => (
    <EmptyState
      icon={Filter}
      message={`Tidak Ada ${activeTab === "split-bill" ? "Transaksi" : "Invoice"}`}
      subtitle={`Tidak ada ${activeTab === "split-bill" ? "transaksi" : "invoice"} dalam periode yang dipilih.`}
      action={
        <Button
          variant="outline"
          onClick={currentFilter.resetFilter}
          className="rounded-lg"
        >
          <X className="w-4 h-4 mr-2" />
          Hapus Filter
        </Button>
      }
    />
  );

  const renderSplitBillList = (data: typeof savedBills) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {data.map((bill) => (
        <Link
          key={bill.id}
          href={`/history/split-bill/${bill.id}`}
          className="block"
        >
          <Card className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-stretch justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <ReceiptText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">
                    {bill.activityName || "Aktivitas Split Bill"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {bill.people.length} Orang • {bill.expenses.length} Item
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 opacity-60">
                    <Clock className="w-2.5 h-2.5" />
                    <p className="text-[9px] font-medium">
                      {new Date(bill.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end justify-between py-0.5">
                <p className="text-xs font-black text-foreground">
                  {formatToIDR(bill.totalAmount)}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-primary">Lihat Detail</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderInvoiceList = (data: typeof invoiceHistory) => (
    <div className="space-y-4">
      {[...data].reverse().map((invoice) => (
        <Link
          key={invoice.id}
          href={`/history/invoice/${invoice.id}`}
          className="block"
        >
          <Card className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-stretch justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">
                    {invoice.invoiceNo}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Ke: {invoice.billedTo?.name || "N/A"}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1 opacity-60">
                      <Clock className="w-2.5 h-2.5" />
                      <p className="text-[9px] font-medium">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full",
                          invoice.status === "paid"
                            ? "bg-green-500"
                            : "bg-orange-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase",
                          invoice.status === "paid"
                            ? "text-green-500"
                            : "text-orange-500",
                        )}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end justify-between py-0.5">
                <p className="text-xs font-black text-foreground">
                  {formatToIDR(invoice.total)}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-primary">Lihat Detail</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Tabs and Filter Button */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SegmentedControl
            options={tabs}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
          />
        </div>
        <button
          onClick={currentFilter.openFilter}
          className="relative p-2.5 rounded-xl bg-white border border-primary/10 hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Filter className="w-5 h-5 text-primary" />
          {currentFilter.hasActiveFilters && (
            <Badge
              variant="default"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0 flex items-center justify-center text-[10px] font-bold"
            >
              {currentFilter.activeFilterCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Active Filter Summary */}
      {currentFilter.hasActiveFilters && (
        <div className="bg-primary/5 border border-primary/10 rounded-md p-3 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex-1">
            <p className="text-xs font-bold text-primary">
              Menampilkan {currentFilter.filteredData.length} dari{" "}
              {activeTab === "split-bill"
                ? savedBills.length
                : invoiceHistory.length}{" "}
              transaksi
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {currentFilter.getFilterSummary()}
            </p>
          </div>
          <button
            onClick={currentFilter.resetFilter}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* List Content */}
      <div className="min-h-[300px]">
        {activeTab === "split-bill"
          ? splitBillFilter.filteredData.length > 0
            ? renderSplitBillList(splitBillFilter.filteredData)
            : currentFilter.hasActiveFilters
              ? renderFilteredEmptyState()
              : renderEmptyState({ type: "split-bill" })
          : invoiceFilter.filteredData.length > 0
            ? renderInvoiceList(invoiceFilter.filteredData)
            : currentFilter.hasActiveFilters
              ? renderFilteredEmptyState()
              : renderEmptyState({ type: "invoice" })}
      </div>

      {/* Filter Bottom Sheets */}
      <TransactionFilterBottomSheet
        isOpen={splitBillFilter.isFilterOpen}
        onClose={splitBillFilter.closeFilter}
        onApplyFilter={splitBillFilter.applyFilter}
        onResetFilter={splitBillFilter.resetFilter}
        currentFilters={splitBillFilter.filters}
      />
      <TransactionFilterBottomSheet
        isOpen={invoiceFilter.isFilterOpen}
        onClose={invoiceFilter.closeFilter}
        onApplyFilter={invoiceFilter.applyFilter}
        onResetFilter={invoiceFilter.resetFilter}
        currentFilters={invoiceFilter.filters}
      />
    </div>
  );
};
