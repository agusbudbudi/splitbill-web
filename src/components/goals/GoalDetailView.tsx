"use client";

import React, { useState, useEffect, useRef } from "react";
import { SharedGoal, useSharedGoalsStore } from "@/store/useSharedGoalsStore";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Calendar,
  Users,
  History,
  TrendingUp,
  Zap,
  Info,
  LineChart,
  ChevronDown,
  ChevronUp,
  Trophy,
  Sparkles,
  Share2,
  Download,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ShareGoalReceipt } from "@/components/goals/ShareGoalReceipt";
import * as htmlToImage from "html-to-image";
import { ContributionInputBottomSheet } from "@/components/goals/ContributionInputBottomSheet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface GoalDetailViewProps {
  goalId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export const GoalDetailView = ({
  goalId,
  onClose,
  onEdit,
}: GoalDetailViewProps) => {
  const { goals, deleteGoal, removeContribution } = useSharedGoalsStore();
  const goal = goals.find((g) => g.id === goalId);

  const [isContributionSheetOpen, setIsContributionSheetOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const hasCelebrated = useRef(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const chartData = React.useMemo(() => {
    if (!goal || goal.contributions.length === 0) return [];

    const sorted = [...goal.contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let runningTotal = 0;
    return sorted.map((c) => {
      runningTotal += c.amount;
      return { date: c.date, amount: runningTotal };
    });
  }, [goal?.contributions]);

  const progress = goal
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    : 0;

  useEffect(() => {
    if (!goal || progress < 100 || hasCelebrated.current) return;

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 200,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    hasCelebrated.current = true;
    toast.success("SELAMAT! Goal kamu terpenuhi! 🥳🎉", {
      duration: 5000,
      icon: "✨",
    });
  }, [progress, goal]);

  const achievedInDays = React.useMemo(() => {
    if (!goal || progress < 100) return null;

    const sorted = [...goal.contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let total = 0;
    let achievementDate = new Date();
    for (const c of sorted) {
      total += c.amount;
      if (total >= goal.targetAmount) {
        achievementDate = new Date(c.date);
        break;
      }
    }

    const start = new Date(goal.createdAt);
    const diffTime = achievementDate.getTime() - start.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  }, [goal, progress]);

  if (!goalId || !goal) return null;

  const memberContributions = goal.members.map((memberId) => {
    const total = goal.contributions
      .filter((c) => c.memberId === memberId)
      .reduce((sum, c) => sum + c.amount, 0);
    const count = goal.contributions.filter(
      (c) => c.memberId === memberId,
    ).length;
    return { id: memberId, amount: total, count };
  });

  const topContributor = [...memberContributions].sort(
    (a, b) => b.amount - a.amount,
  )[0];
  const mostFrequentSaver = [...memberContributions].sort(
    (a, b) => b.count - a.count,
  )[0];

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = goal.deadline ? getDaysLeft(goal.deadline) : null;

  // Savings Insights Calculations
  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const calculateMonthlyTarget = () => {
    if (!goal.deadline || remainingAmount <= 0) return null;
    const today = new Date();
    const targetDate = new Date(goal.deadline);
    let months =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    // If less than a month but still in the future, treat as 1 month or use days
    if (months <= 0) {
      const days = getDaysLeft(goal.deadline);
      if (days > 0) return remainingAmount / (days / 30); // Approximate monthly
      return null;
    }
    return remainingAmount / months;
  };

  const calculateForecast = () => {
    if (remainingAmount <= 0) return "Finished";
    if (goal.contributions.length === 0) return null;

    // Average savings per month (or total/period)
    const sortedContributions = [...goal.contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const firstDate = new Date(sortedContributions[0].date);
    const lastDate = new Date();
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    const dailyAvg = goal.currentAmount / diffDays;

    if (dailyAvg <= 0) return null;

    const daysToFinish = Math.ceil(remainingAmount / dailyAvg);
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + daysToFinish);

    return finishDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const monthlyTarget = calculateMonthlyTarget();
  const estimatedFinish = calculateForecast();

  const generateChartPath = (
    data: { amount: number }[],
    width: number,
    height: number,
  ) => {
    if (data.length < 2) return "";
    const max = Math.max(...data.map((d) => d.amount), goal.targetAmount / 10);
    const min = 0;

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((d.amount - min) / (max - min)) * height,
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  const milestones = [
    { percent: 25, label: "Quarter" },
    { percent: 50, label: "Halfway" },
    { percent: 75, label: "Almost" },
  ];

  const getEncouragementMessage = () => {
    if (progress >= 100) return "Luar biasa! Goal terpenuhi! 🏁✨";
    if (progress >= 75)
      return "Sedikit lagi! Kamu hampir sampai di garis finish! 🏁";
    if (progress >= 50) return "Wah, kamu sudah setengah jalan! Keep it up! 🚀";
    if (progress >= 25) return "Awal yang bagus! Terus konsisten ya! 💪";
    return "Mulai langkah pertamamu sekarang! 🌱";
  };

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
      month: "short",
      year: "numeric",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

    return formatDate(dateString);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    toast.success("Goal deleted");
    onClose();
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;

    setIsSharing(true);
    const toastId = toast.loading("Menyiapkan gambar progress...");

    try {
      // Small delay to ensure any dynamic content is settled
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Progress-${goal.name.replace(/\s+/g, "-")}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Gambar berhasil disimpan! 🎉", { id: toastId });
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.error("Gagal membuat gambar sharing.", { id: toastId });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* Hidden Sharing Canvas */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <ShareGoalReceipt ref={receiptRef} goal={goal} progress={progress} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col pb-10">
        {/* Sticky Header */}
        <Header
          title="Detail Goal"
          showBackButton={true}
          alignTitle="left"
          transparent
          onBack={onClose}
          // className="px-4"
          rightContent={
            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                title="Bagikan Progress"
              >
                <Share2
                  className={cn("w-5 h-5", isSharing && "animate-pulse")}
                />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          }
        />

        <div className="px-4">
            {/* Hero Card - Overlapping */}
            <div className="mt-4 text-center text-white mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="font-bold text-white text-lg leading-none">
                  {goal.name}
                </p>
                <button
                  onClick={() => onEdit(goal.id)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95 cursor-pointer"
                  title="Edit Goal"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <h1 className="text-4xl font-black tracking-tighter mb-4">
                {formatCurrency(goal.currentAmount)}
              </h1>

              {goal.deadline && (
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5 py-1.5">
                    <Calendar className="w-3 h-3 text-white/70" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                      Deadline: {formatDate(goal.deadline)}
                    </span>
                  </div>
                  {progress >= 100 ? (
                    <div className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-emerald-500/20">
                      Achieved in {achievedInDays} Days
                    </div>
                  ) : (
                    <>
                      {daysLeft !== null && daysLeft > 0 && (
                        <div className="px-1.5 py-0.5 bg-white text-primary text-[9px] font-black uppercase rounded-full">
                          {daysLeft} Days Left
                        </div>
                      )}
                      {daysLeft !== null && daysLeft === 0 && (
                        <div className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-black uppercase rounded-full">
                          Due Today
                        </div>
                      )}
                      {daysLeft !== null && daysLeft < 0 && (
                        <div className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-full">
                          Overdue
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Celebration Card - Banner Style */}
            {progress >= 100 && (
              <div className="mb-6 mt-4 animate-in zoom-in-95 fade-in duration-500 cursor-default">
                <div className="relative rounded-2xl p-6 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-50/60 border border-emerald-100/50 shadow-2xl shadow-emerald-600/5 backdrop-blur-md group">
                  {/* Floating Icon Foreground - Pop Up Effect */}
                  <div className="absolute -top-3 right-4 p-1 opacity-100 transition-transform group-hover:scale-110 group-hover:rotate-6 z-20">
                    <img
                      alt="Achieve Goal"
                      className="w-28 h-28 object-contain "
                      src="/img/feature-shared-goals-achieved.png"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-primary tracking-tight">
                        Goal Terpenuhi! 🥳
                      </h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-[11px] text-slate-500 font-bold max-w-[220px] leading-relaxed">
                        Luar biasa! Target kamu sudah tercapai. Waktunya
                        eksekusi mimpimu sekarang!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Card className="border-none shadow-md shadow-primary/10 bg-white relative overflow-hidden mb-6">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      Progress
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Progress Bar with Milestones */}
                <div className="space-y-3">
                  <div className="w-full bg-muted/40 h-2.5 rounded-full relative">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out relative z-10",
                        progress >= 100
                          ? "bg-gradient-to-r from-emerald-400 to-green-400"
                          : "bg-primary",
                      )}
                      style={{ width: `${progress}%` }}
                    />

                    {/* Milestone Pins */}
                    {milestones.map((m) => (
                      <div
                        key={m.percent}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                        style={{ left: `${m.percent}%` }}
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full border border-white transition-all duration-500",
                            progress >= m.percent
                              ? "bg-white scale-125"
                              : "bg-muted-foreground/30",
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-muted-foreground">Target Goal</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Savings Insight Card */}
            {(monthlyTarget || estimatedFinish) && remainingAmount > 0 && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Zap className="w-12 h-12 text-primary" />
                  </div>
                  <div className="p-4 relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Savings Insights
                      </span>
                    </div>

                    <div className="space-y-3">
                      {monthlyTarget && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            Target Bulanan <Info className="w-2.5 h-2.5" />
                          </span>
                          <p className="text-sm font-bold text-foreground">
                            Tambah{" "}
                            <span className="text-primary">
                              {formatCurrency(monthlyTarget)}
                            </span>
                            /bulan lagi untuk capai deadline.
                          </p>
                        </div>
                      )}

                      {estimatedFinish && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Estimasi Selesai
                          </span>
                          <p className="text-sm font-bold text-foreground">
                            Berdasarkan trenmu, goal ini diprediksi selesai di{" "}
                            <span className="text-primary">
                              {estimatedFinish}
                            </span>
                            .
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-2.5 bg-primary/10 rounded-xl border border-primary/20 animate-in zoom-in-95 duration-700">
                      <p className="text-[10px] font-bold text-primary text-center">
                        {getEncouragementMessage()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contribution Trends Chart Section */}
            {chartData.length >= 2 && (
              <Card className="border-none shadow-soft overflow-hidden mb-6 group cursor-default">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        Tren Tabungan
                      </span>
                      <span className="text-xs font-bold text-foreground mt-0.5">
                        Pertumbuhan Dana
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  <div className="relative h-24 w-full">
                    <svg
                      viewBox="0 0 400 100"
                      className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(var(--primary-rgb),0.2)]"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--primary)"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--primary)"
                            stopOpacity="0.01"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d={`${generateChartPath(chartData, 400, 100)} L 400 100 L 0 100 Z`}
                        fill="url(#chartGradient)"
                        className="transition-all duration-1000"
                      />
                      <path
                        d={generateChartPath(chartData, 400, 100)}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-muted/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        Terakhir Update
                      </span>
                      <span className="text-[10px] font-bold text-foreground">
                        {chartData.length > 0
                          ? formatDate(chartData[chartData.length - 1].date)
                          : "-"}
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        Total Kontribusi
                      </span>
                      <span className="text-[10px] font-bold text-primary">
                        {chartData.length} Transaksi
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <Card className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all">
                <CardContent className="p-4 flex flex-col gap-3">
                  {goal.contributions.length > 0 && (
                    <>
                      <div className="flex items-center justify-between border-b border-dashed border-muted pb-2">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Leaderboard 🏆
                          </span>
                        </div>
                      </div>

                      {/* Leaderboard Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        {/* Top Contributor */}
                        <div className="relative p-3 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border border-yellow-100/50 animate-in slide-in-from-left duration-500">
                          <div className="absolute top-2 right-2">
                            <Trophy className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-yellow-200 shadow-soft overflow-hidden bg-white ring-4 ring-yellow-400/10 transition-transform hover:scale-110 duration-300">
                              <img
                                src={`${AVATAR_BASE_URL}${encodeURIComponent(topContributor?.id || "")}`}
                                alt={topContributor?.id}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-[9px] font-black text-yellow-600 uppercase tracking-tighter">
                                Biggest Contributor
                              </p>
                              <p className="text-xs font-bold text-foreground truncate max-w-[80px] mx-auto">
                                {topContributor?.id}
                              </p>
                              <p className="text-[10px] font-black text-primary">
                                {formatCurrency(topContributor?.amount || 0)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Most Frequent Saver */}
                        <div className="relative p-3 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100/50 animate-in slide-in-from-right duration-500 delay-150">
                          <div className="absolute top-2 right-2">
                            <Zap className="w-4 h-4 text-orange-500 drop-shadow-sm" />
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-orange-200 shadow-soft overflow-hidden bg-white ring-4 ring-orange-400/10 transition-transform hover:scale-110 duration-300">
                              <img
                                src={`${AVATAR_BASE_URL}${encodeURIComponent(mostFrequentSaver?.id || "")}`}
                                alt={mostFrequentSaver?.id}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">
                                Most Frequent Saver
                              </p>
                              <p className="text-xs font-bold text-foreground truncate max-w-[80px] mx-auto">
                                {mostFrequentSaver?.id}
                              </p>
                              <p className="text-[10px] font-black text-primary">
                                {mostFrequentSaver?.count || 0} Tabungan
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between border-b border-dashed border-muted pb-2 mt-2">
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Semua Kontributor
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {goal.members.length} Orang
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {memberContributions.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1 animate-in fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white shrink-0">
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(member.id)}`}
                              alt={member.id}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {member.id}
                          </span>
                        </div>
                        <span className="text-xs font-black text-primary">
                          {formatCurrency(member.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2">
                  <History className="w-4 h-4" /> Riwayat Tabungan
                </h3>
              </div>

              {goal.contributions.length === 0 ? (
                <Card className="border-none shadow-soft overflow-hidden">
                  <CardContent className="p-4">
                    <EmptyState
                      message="Belum ada transaksi"
                      subtitle="Yuk mulai menabung sekarang!"
                      icon={History}
                      className="bg-primary/5"
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {(showAllTransactions
                    ? goal.contributions
                    : goal.contributions.slice(0, 3)
                  ).map((contribution) => (
                    <Card
                      key={contribution.id}
                      className="border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all group"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-soft overflow-hidden bg-white shrink-0">
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(contribution.memberId)}`}
                              alt={contribution.memberId}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs text-foreground">
                              {contribution.memberId}
                            </p>
                            <div className="flex items-center gap-1 opacity-60">
                              <History className="w-2.5 h-2.5" />
                              <p className="text-[9px] font-medium">
                                {getRelativeTime(contribution.date)}
                              </p>
                            </div>
                            {contribution.note && (
                              <p className="text-[10px] text-muted-foreground mt-1 bg-primary/5 px-2 py-0.5 rounded-md inline-block border border-primary/10">
                                {contribution.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-black text-xs text-green-600">
                            +{formatCurrency(contribution.amount)}
                          </span>
                          <button
                            onClick={() =>
                              removeContribution(goal.id, contribution.id)
                            }
                            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {goal.contributions.length > 3 && (
                    <button
                      onClick={() =>
                        setShowAllTransactions(!showAllTransactions)
                      }
                      className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-sm transition-colors mt-2 cursor-pointer"
                    >
                      {showAllTransactions ? (
                        <>
                          Sembunyikan <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Lihat Selengkapnya ({goal.contributions.length - 3}{" "}
                          Lainnya) <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Sticky CTA Footer - Matched with Split Bill Page logic */}
      <div className="sticky bottom-0 w-full z-[110] pointer-events-none flex justify-center mt-auto">
        <div className="w-full relative pointer-events-auto flex flex-col px-0">
          <div className="bg-background px-4 pb-4 pt-2 flex flex-col gap-3 border-t border-muted/20 shadow-[-0_-10px_30px_rgba(0,0,0,0.02)]">
            <Button
              onClick={() => setIsContributionSheetOpen(true)}
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 bg-primary text-white active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" /> Tambah Tabungan
            </Button>
          </div>
        </div>
      </div>

        {/* Modals */}
        <ContributionInputBottomSheet
          isOpen={isContributionSheetOpen}
          onClose={() => setIsContributionSheetOpen(false)}
          goal={goal}
        />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Goal?"
        description="Data tabungan akan hilang permanen. Yakin mau hapus?"
        icon={Trash2}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmButtonClassName="bg-red-600 text-white shadow-red-200"
      />
    </>
  );
};
