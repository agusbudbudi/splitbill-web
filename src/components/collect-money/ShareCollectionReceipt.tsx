import React from "react";
import { CollectionSession } from "@/store/useCollectMoneyStore";
import { Users, CheckCircle2, Clock, Wallet } from "lucide-react";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface ShareCollectionReceiptProps {
  collection: CollectionSession;
  progress: number;
}

export const ShareCollectionReceipt = React.forwardRef<
  HTMLDivElement,
  ShareCollectionReceiptProps
>(({ collection, progress }, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressEmoji = (pct: number) => {
    if (pct >= 100) return "🥳";
    if (pct >= 75) return "💸";
    if (pct >= 50) return "💰";
    if (pct >= 25) return "🔥";
    return "💪🏻";
  };

  const paidPayers = collection.payers.filter((p) => p.isPaid);
  const unpaidPayers = collection.payers.filter((p) => !p.isPaid);
  const paidTotal = paidPayers.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div
      ref={ref}
      className="w-[1080px] bg-white p-16 font-sans relative overflow-hidden flex flex-col items-center"
      style={{ minHeight: "1350px" }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[280px] bg-slate-50 z-0 rounded-b-[80px] border-b border-slate-100" />
      <div className="absolute top-20 right-20 w-[400px] h-[350px] bg-primary/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl z-0" />

      {/* Branding */}
      <div className="relative z-10 w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-primary/5 p-2">
            <img
              src="/img/footer-icon.png"
              alt="SplitBill Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h4 className="text-primary text-3xl font-black italic tracking-tighter leading-none">
              SPLITBILL
            </h4>
            <p className="text-slate-500 text-lg font-bold uppercase tracking-widest mt-1">
              Collect Money
            </p>
          </div>
        </div>
        <div className="px-6 py-2 bg-primary/10 backdrop-blur-md rounded-full border border-primary/10">
          <span className="text-primary text-lg font-bold">
            #PatunganBareng
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-8">
        <div className="mb-6 relative">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center relative z-10 overflow-hidden border-4 border-primary/10 text-6xl">
            {getProgressEmoji(progress)}
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-40 animate-pulse rounded-full" />
        </div>
        <h1 className="text-primary text-5xl font-black tracking-tight mb-4 max-w-[800px]">
          {collection.title}
        </h1>
        <div className="flex items-center gap-3 text-slate-500 text-2xl font-bold uppercase tracking-widest">
          <Wallet className="w-6 h-6 text-primary" />
          <span>Target: {formatCurrency(collection.totalAmount)}</span>
        </div>
      </div>

      {/* Progress Display */}
      <div className="relative z-10 w-full bg-white rounded-[40px] border border-primary/5 p-12 mt-16 flex flex-col gap-10">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 text-xl font-bold uppercase tracking-widest">
              Terkumpul
            </span>
            <span className="text-6xl font-black text-primary">
              {formatCurrency(paidTotal)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-slate-500 text-xl font-bold uppercase tracking-widest">
              Progress
            </span>
            <span className="text-6xl font-black text-primary">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full relative z-10 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 right-0 h-full flex items-center pr-6 z-20">
            <span className="text-slate-900 font-extrabold text-xl">
              {formatCurrency(collection.totalAmount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-lg font-bold uppercase">
                Sudah Bayar
              </p>
              <p className="text-2xl font-black text-slate-800">
                {paidPayers.length} Orang
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-lg font-bold uppercase">
                Belum Bayar
              </p>
              <p className="text-2xl font-black text-slate-800">
                {unpaidPayers.length} Orang
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payers List - Paid */}
      {paidPayers.length > 0 && (
        <div className="relative z-10 w-full mt-12 px-2">
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            Sudah Bayar
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {paidPayers.slice(0, 5).map((payer, idx) => (
              <div
                key={payer.id}
                className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shrink-0">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(payer.name)}-${idx}`}
                      alt={payer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-700">
                      {payer.name}
                    </span>
                    {payer.transferTo && (
                      <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md self-start mt-1">
                        Transfer ke {payer.transferTo}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-primary">
                    {formatCurrency(payer.amount)}
                  </span>
                  <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold">
                    ✓ Lunas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payers List - Unpaid */}
      {unpaidPayers.length > 0 && (
        <div className="relative z-10 w-full mt-8 px-2">
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <Clock className="w-7 h-7 text-amber-600" />
            Belum Bayar
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {unpaidPayers.slice(0, 3).map((payer, idx) => (
              <div
                key={payer.id}
                className="bg-amber-50/30 border border-amber-100 rounded-3xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shrink-0">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(payer.name)}-unpaid-${idx}`}
                      alt={payer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-700">
                      {payer.name}
                    </span>
                    {payer.transferTo && (
                      <span className="text-sm font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md self-start mt-1">
                        Transfer ke {payer.transferTo}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(payer.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Brand */}
      <div className="relative z-10 mt-auto pt-16 pb-8 text-center">
        <p className="text-slate-600 text-xl font-bold">
          Tagih patungan jadi lebih mudah bareng SplitBill
        </p>
        <p className="text-primary font-black text-2xl mt-2 tracking-tight">
          www.splitbill.my.id
        </p>
      </div>
    </div>
  );
});

ShareCollectionReceipt.displayName = "ShareCollectionReceipt";
