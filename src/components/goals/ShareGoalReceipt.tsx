import React from "react";
import { SharedGoal } from "@/store/useSharedGoalsStore";
import { Users, History, TrendingUp, Sparkles, Calendar } from "lucide-react";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface ShareGoalReceiptProps {
  goal: SharedGoal;
  progress: number;
}

export const ShareGoalReceipt = React.forwardRef<
  HTMLDivElement,
  ShareGoalReceiptProps
>(({ goal, progress }, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getProgressEmoji = (pct: number) => {
    if (pct >= 100) return "🥳";
    if (pct >= 75) return "💸";
    if (pct >= 50) return "✈️";
    if (pct >= 25) return "🔥";
    return "💪🏻";
  };

  return (
    <div
      ref={ref}
      className="w-[1080px] bg-white p-16 font-sans relative overflow-hidden flex flex-col items-center"
      style={{ minHeight: "1350px" }}
    >
      {/* Background Decorative Elements - Adjusted height to overlap half the icon (approx 280px) */}
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
              Goal Success
            </p>
          </div>
        </div>
        <div className="px-6 py-2 bg-primary/10 backdrop-blur-md rounded-full border border-primary/10">
          <span className="text-primary text-lg font-bold">#NabungBareng</span>
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
          {goal.name}
        </h1>
        <div className="flex items-center gap-3 text-slate-500 text-2xl font-bold uppercase tracking-widest">
          <Calendar className="w-6 h-6 text-primary" />
          <span>
            Target: {formatDate(goal.deadline || new Date().toISOString())}
          </span>
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
              {formatCurrency(goal.currentAmount)}
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
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500 text-lg font-bold uppercase">
                Kontributor
              </p>
              <p className="text-2xl font-black text-slate-800">
                {goal.members.length} Orang
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-lg font-bold uppercase">
                Total Setoran
              </p>
              <p className="text-2xl font-black text-slate-800">
                {goal.contributions.length} Transaksi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors List - Top 3 */}
      <div className="relative z-10 w-full mt-12 px-2">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <History className="w-7 h-7 text-primary" />
          Top Kontributor
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {goal.members.slice(0, 3).map((memberId, idx) => {
            const total = goal.contributions
              .filter((c) => c.memberId === memberId)
              .reduce((sum, c) => sum + c.amount, 0);
            return (
              <div
                key={memberId}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shrink-0">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(memberId)}-${idx}`}
                      alt={memberId}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-2xl font-bold text-slate-700">
                    {memberId}
                  </span>
                </div>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Brand */}
      <div className="relative z-10 mt-auto pt-16 pb-8 text-center">
        <p className="text-slate-600 text-xl font-bold">
          Bikin rencana tabungan jadi kenyataan bareng SplitBill
        </p>
        <p className="text-primary font-black text-2xl mt-2 tracking-tight">
          www.splitbill.my.id
        </p>
      </div>
    </div>
  );
});

ShareGoalReceipt.displayName = "ShareGoalReceipt";
