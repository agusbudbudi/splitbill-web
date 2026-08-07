import { Skeleton } from "./Skeleton";
import { Card, CardContent } from "./Card";

/** Matches the icon+2-line-text+trailing-amount card shape used across
 * split-bill/invoice/order list rows (HistoryTab, OrdersPanel, SplitBillPanel, InvoiceLanding). */
export function TransactionCardSkeleton() {
  return (
    <Card className="shadow-md overflow-hidden relative">
      <CardContent className="p-4 flex items-stretch justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-2 py-0.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between py-0.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
