"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Gift,
  HelpCircle,
  Lock,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatCompactIDR, formatToIDR } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/stores/uiStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { claimLevelReward, fetchLevels, fetchMyLevel } from "@/lib/api/levels";
import {
  computeAchievableProgress,
  formatRewardSentence,
  getLevelThemeIndex,
  LEVEL_ICONS,
  LEVEL_METRIC_LABELS,
  LEVEL_THEMES,
  type RuleProgress,
} from "@/lib/utils/level";
import type { LevelAchievement, UserLevel, UserLevelMeResponse } from "@/lib/types/level";

type LevelStatus = "current" | "achieved" | "next" | "locked";

const BENEFIT_ICONS = [Award, Gift, Wallet, Star, Sparkles, CheckCircle2];

const METRIC_IMAGES = {
  splitCount: "/img/user-level/split-bill.png",
  totalAmount: "/img/user-level/total-nominal.png",
  friendCount: "/img/user-level/teman.png",
} as const;

const REWARD_ICONS = {
  free_scan_ai: "/img/cara-pakai/split-bill/ai-scan-struk.png",
  max_split_bill: "/img/user-level/split-bill.png",
} as const;

const SWIPE_THRESHOLD = 60;

// Desain hero lama — disembunyikan, kodenya sengaja dipertahankan (bukan
// dihapus) buat referensi atau kalau mau dibalikin lagi.
const SHOW_LEGACY_HERO = false;

const contentVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -36 : 36, opacity: 0 }),
};

function ProgressRow({ rule, remaining, percent }: RuleProgress) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <div className="w-11 h-11 shrink-0 rounded-sm bg-primary/10 flex items-center justify-center p-1.5">
        <img
          src={METRIC_IMAGES[rule.metric]}
          alt={LEVEL_METRIC_LABELS[rule.metric]}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-foreground capitalize">
            {LEVEL_METRIC_LABELS[rule.metric]}
          </p>
          <span className="text-xs font-bold text-muted-foreground">{percent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {remaining > 0
            ? `Butuh ${rule.metric === "totalAmount" ? formatToIDR(remaining) : remaining} ${LEVEL_METRIC_LABELS[rule.metric]} lagi`
            : `${LEVEL_METRIC_LABELS[rule.metric]} sudah cukup`}
        </p>
      </div>
    </div>
  );
}

function getStatus(
  level: UserLevel,
  me: UserLevelMeResponse | null,
): LevelStatus {
  if (!me?.currentLevel) return "locked";
  if (level.id === me.currentLevel.id) return "current";
  if (me.nextLevel && level.id === me.nextLevel.id) return "next";
  if (level.order <= me.currentLevel.order) return "achieved";
  return "locked";
}

function LevelPageSkeleton() {
  return (
    <div className="animate-pulse relative">
      {/* Hero */}
      <div className="relative overflow-hidden bg-muted px-5 pt-4 pb-16 lg:rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-full bg-muted-foreground/15 shrink-0" />
          <div className="w-9 h-9 rounded-full bg-muted-foreground/15 shrink-0" />
        </div>

        <div className="grid grid-cols-[45%_55%] items-center">
          <div className="h-32" />
          <div className="min-w-0 space-y-2">
            <div className="h-5 w-20 rounded-full bg-muted-foreground/15" />
            <div className="h-6 w-32 rounded bg-muted-foreground/15" />
            <div className="h-4 w-40 rounded bg-muted-foreground/15" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 pt-3 pb-10 flex items-center justify-center gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      {/* Character image placeholder — overlap hero/body sama kayak LevelStage */}
      <div className="absolute top-8 w-[45%] h-50 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-muted-foreground/15" />
      </div>

      {/* Body */}
      <div className="relative -mt-6 rounded-t-xl bg-white border-x border-t border-border/60 px-5 pt-7 pb-5 lg:rounded-b-xl lg:border-b lg:shadow-soft space-y-6">
        <div className="grid grid-cols-3 text-center rounded-sm border border-border/60 py-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="px-2 space-y-1.5 flex flex-col items-center">
              <div className="h-5 w-10 rounded bg-muted" />
              <div className="h-2.5 w-14 rounded bg-muted" />
            </div>
          ))}
        </div>

        <div className="rounded-sm border border-border/60 p-3.5 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="h-3.5 w-24 rounded bg-muted" />
          </div>
          <div className="h-2 w-full rounded-full bg-muted" />
        </div>

        <div className="rounded-sm bg-muted/60 divide-y divide-border/50">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3.5 py-3">
              <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
              <div className="h-3 w-40 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero — layout horizontal (icon kiri, teks kanan) dengan dot indicator
// nempel di footer card. Frame diam, cuma dot yang update pas swipe.
interface LevelHeroAltProps {
  level: UserLevel;
  levels: UserLevel[];
  total: number;
  activeIndex: number;
  currentLevelOrder: number | null;
  status: LevelStatus;
  onDotClick: (index: number) => void;
  onSwipe: (info: PanInfo) => void;
}

function LevelHeroAlt({
  level,
  levels,
  total,
  activeIndex,
  currentLevelOrder,
  status,
  onDotClick,
  onSwipe,
}: LevelHeroAltProps) {
  // Theme diturunkan dari level.order, bukan posisi array — biar konsisten
  // sama MyLevelCard walau order-nya someday gak kontiguous 1..N.
  const theme = LEVEL_THEMES[getLevelThemeIndex(level.order)];
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => onSwipe(info)}
      className={cn(
        "relative overflow-hidden px-5 pt-4 pb-16 touch-pan-y lg:rounded-t-lg",
        theme.accent,
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 cursor-pointer"
          aria-label="Info sistem level"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-[45%_55%] items-center">
        {/* Spacer 45% — gambar asli dirender di luar (LevelStage) biar bisa overlap ke card bawah */}
        <div className="h-32" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white",
                theme.badge,
              )}
            >
              Level {level.order}
            </span>
            {status === "next" && (
              <span className="inline-flex items-center rounded-full bg-black/20 px-2.5 py-1 text-xs font-bold text-white">
                Level berikutnya
              </span>
            )}
            {status === "locked" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-bold text-white">
                <Lock className="w-2.5 h-2.5" /> Belum terbuka
              </span>
            )}
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-white">{level.name}</h2>
          {level.description && (
            <p className="mt-1 text-sm text-white/85">{level.description}</p>
          )}
        </div>
      </div>

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 pt-3 pb-10 flex items-center justify-center gap-1.5">
          {levels.map((dotLevel, dotIndex) => {
            const isAchieved =
              currentLevelOrder != null && dotLevel.order <= currentLevelOrder;
            const isActive = dotIndex === activeIndex;
            return (
              <button
                key={dotLevel.id}
                type="button"
                aria-label={`Lihat ${dotLevel.name}`}
                onClick={() => onDotClick(dotIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  isActive
                    ? "w-6 bg-white"
                    : isAchieved
                      ? "w-1.5 bg-white/80"
                      : "w-1.5 bg-white/30",
                )}
              />
            );
          })}
        </div>
      )}

      <BottomSheet
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="Tentang Level"
      >
        <div className="space-y-4 text-sm text-foreground/90">
          <p>
            Level naik otomatis berdasarkan aktivitasmu di Split Bill. Makin
            aktif, makin tinggi levelnya.
          </p>
          <div className="rounded-sm bg-muted/60 divide-y divide-border/50">
            <div className="flex items-center gap-3 px-3.5 py-3">
              <span className="w-9 h-9 rounded-xs bg-primary/10 flex items-center justify-center shrink-0 p-1.5">
                <img src={METRIC_IMAGES.splitCount} alt="" className="w-full h-full object-contain" />
              </span>
              <p className="text-sm font-semibold text-foreground/90 leading-snug">
                Jumlah split bill yang sudah dibuat
              </p>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-3">
              <span className="w-9 h-9 rounded-xs bg-primary/10 flex items-center justify-center shrink-0 p-1.5">
                <img src={METRIC_IMAGES.totalAmount} alt="" className="w-full h-full object-contain" />
              </span>
              <p className="text-sm font-semibold text-foreground/90 leading-snug">
                Total nominal transaksi split bill
              </p>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-3">
              <span className="w-9 h-9 rounded-xs bg-primary/10 flex items-center justify-center shrink-0 p-1.5">
                <img src={METRIC_IMAGES.friendCount} alt="" className="w-full h-full object-contain" />
              </span>
              <p className="text-sm font-semibold text-foreground/90 leading-snug">
                Jumlah teman yang tersimpan
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tiap level punya syarat sendiri dan bisa unlock benefit tambahan.
            Geser kartu atau tap titik indikator buat lihat level lain.
          </p>
        </div>
      </BottomSheet>
    </motion.div>
  );
}

interface LevelStageProps {
  level: UserLevel;
  levels: UserLevel[];
  direction: number;
  total: number;
  activeIndex: number;
  currentLevelOrder: number | null;
  onDotClick: (index: number) => void;
  onSwipe: (info: PanInfo) => void;
  status: LevelStatus;
  stats: UserLevelMeResponse["stats"] | null;
  achievement: LevelAchievement | null;
  isClaiming: boolean;
  onClaim: (levelId: string) => void;
}

function LevelStage({
  level,
  levels,
  direction,
  total,
  activeIndex,
  currentLevelOrder,
  onDotClick,
  onSwipe,
  status,
  stats,
  achievement,
  isClaiming,
  onClaim,
}: LevelStageProps) {
  const isDone = status === "current" || status === "achieved";
  const isLocked = !isDone;
  // Theme/icon diturunkan dari level.order (bukan posisi array) biar konsisten
  // sama MyLevelCard walau order-nya someday gak kontiguous 1..N.
  const themeIndex = getLevelThemeIndex(level.order);
  const theme = LEVEL_THEMES[themeIndex];
  const iconSrc = level.icon || LEVEL_ICONS[themeIndex];
  const progress = stats ? computeAchievableProgress(level.rules, stats) : [];

  // Benefit yang sudah dimiliki dari level sebelumnya (carried over) dipisah
  // dari benefit baru, biar progression-nya kerasa (bukan daftar berulang).
  const prevLevel = levels[activeIndex - 1] ?? null;
  const prevBenefitSet = new Set(prevLevel?.benefits ?? []);
  const newBenefits = level.benefits.filter((b) => !prevBenefitSet.has(b));
  const carriedBenefits = level.benefits.filter((b) => prevBenefitSet.has(b));

  return (
    <div className="relative">
      <LevelHeroAlt
        level={level}
        levels={levels}
        total={total}
        activeIndex={activeIndex}
        currentLevelOrder={currentLevelOrder}
        status={status}
        onDotClick={onDotClick}
        onSwipe={onSwipe}
      />

      {/* Gambar karakter — sibling di antara Hero & Body (urutan DOM biasa,
          gak pakai z-index) biar nempel di atas Hero tapi ketiban Body pas overlap. */}
      <div className="absolute top-8 w-[45%] h-50 pointer-events-none">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={level.id}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <img
              src={iconSrc}
              alt={level.name}
              className={cn("w-full h-full object-contain", isLocked && "grayscale opacity-60")}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white drop-shadow" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desain hero lama — disembunyikan (SHOW_LEGACY_HERO), kodenya sengaja
          dipertahankan buat referensi/dibalikin lagi kalau perlu. */}
      {SHOW_LEGACY_HERO && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => onSwipe(info)}
          className={cn(
            "relative overflow-hidden px-5 pt-4 pb-12 touch-pan-y lg:rounded-t-lg",
            theme.accent,
          )}
        >
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/member/profile"
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0"
              aria-label="Kembali ke profil"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-lg font-black text-white">Level</span>
            <span className="w-9 h-9 shrink-0" />
          </div>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={level.id}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >

              <div className="flex flex-col items-center text-center mt-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <img
                    src={iconSrc}
                    alt={level.name}
                    className={cn(
                      "w-full h-full object-contain",
                      isLocked && "grayscale opacity-60",
                    )}
                  />
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white drop-shadow" />
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                  {level.name}
                </h2>
                {level.description && (
                  <p className="mt-1 text-base text-white/85 max-w-[280px]">
                    {level.description}
                  </p>
                )}

                <span
                  className={cn(
                    "mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white",
                    theme.badge,
                  )}
                >
                  Level {level.order}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {total > 1 && (
            <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: total }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Lihat level ke-${dotIndex + 1}`}
                  onClick={() => onDotClick(dotIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    dotIndex === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40",
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Body — frame diam, isinya slide bareng hero pas ganti level */}
      <motion.div
        layout
        className="relative -mt-6 rounded-t-xl bg-white border-x border-t border-border/60 px-5 pt-7 pb-5 overflow-hidden lg:rounded-b-xl lg:border-b lg:shadow-soft"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={level.id}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {isDone && (
              <div className="-mt-7 -mx-5 rounded-t-xl bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-xs font-bold text-green-700">
                  Level ini sudah kamu capai. Kerja bagus! 🎉
                </p>
              </div>
            )}

            {stats && (
              <div className="grid grid-cols-3 text-center rounded-sm border border-border/60 py-4">
                <div className="px-2">
                  <p className="text-lg font-black text-primary">{stats.splitCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wide">
                    Split Bill
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-lg font-black text-primary">
                    {formatCompactIDR(stats.totalAmount)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wide">
                    Total Nominal
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-lg font-black text-primary">{stats.friendCount}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wide">
                    Teman
                  </p>
                </div>
              </div>
            )}

            {!isDone && progress.length > 0 ? (
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">
                  Menuju {level.name}
                </h3>
                {progress.length > 1 && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Capai salah satu target berikut buat naik level:
                  </p>
                )}
                <div className={cn("rounded-sm border border-border/60 divide-y divide-border/50", progress.length === 1 && "mt-3")}>
                  {progress.map((item, idx) => (
                    <ProgressRow key={idx} {...item} />
                  ))}
                </div>
              </div>
            ) : null}

            {(level.benefits.length > 0 ||
              (achievement && achievement.rewardsSnapshot.length > 0)) && (
                <div className="space-y-4">
                  {newBenefits.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-3">
                        {isDone ? "Yang Kamu Dapat" : "Benefit yang Kebuka"}
                      </h3>
                      <div className="rounded-sm bg-muted/60 divide-y divide-border/50">
                        {newBenefits.map((benefit, idx) => {
                          const Icon = BENEFIT_ICONS[idx % BENEFIT_ICONS.length];
                          return (
                            <div key={idx} className="flex items-center gap-3 px-3.5 py-3">
                              <span className="w-9 h-9 rounded-xs bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4" />
                              </span>
                              <p className="text-sm font-semibold text-foreground/90 leading-snug">
                                {benefit}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {achievement && achievement.rewardsSnapshot.length > 0 ? (
                    achievement.claimed ? (
                      <div className="flex items-start gap-2.5 rounded-sm bg-green-50 border border-green-100 px-3.5 py-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800 leading-relaxed">
                          Reward level ini udah kamu klaim:{" "}
                          {achievement.rewardsSnapshot.map(formatRewardSentence).join(", ")}.
                        </p>
                      </div>
                    ) : (
                      <div className={cn("relative overflow-hidden rounded-sm p-4 space-y-3", theme.accent)}>
                        <div className="relative flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 p-1.5">
                            <img
                              src="/img/user-level/rewards-icon.png"
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white">Reward menanti!</p>
                            <p className="text-[11px] text-white/80">Klaim sekarang, langsung aktif</p>
                          </div>
                        </div>
                        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
                          {achievement.rewardsSnapshot.map((reward, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 rounded-xs bg-white/15 px-2.5 py-2"
                            >
                              <img
                                src={REWARD_ICONS[reward.benefitType]}
                                alt=""
                                className="w-8 h-8 shrink-0 object-contain"
                              />
                              <p className="text-xs font-bold text-white">
                                {formatRewardSentence(reward)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          className="relative w-full bg-white hover:bg-white/90"
                          style={{ color: theme.heroColor }}
                          loading={isClaiming}
                          onClick={() => onClaim(level.id)}
                        >
                          Klaim Reward
                        </Button>
                      </div>
                    )
                  ) : null}

                  {carriedBenefits.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground mb-2">
                        Sudah aktif sejak level sebelumnya
                      </h3>
                      <div className="rounded-sm divide-y divide-border/50">
                        {carriedBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3 px-3.5 py-3.5">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <p className="text-sm font-medium text-muted-foreground leading-snug">
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {activeIndex + 1 < total && (
              <button
                type="button"
                onClick={() => onDotClick(activeIndex + 1)}
                className="w-full flex items-center justify-center gap-1 rounded-sm border border-border/60 py-3 text-sm font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors"
              >
                Lihat level berikutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function LevelDetailPanel() {
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [me, setMe] = useState<UserLevelMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [claimingLevelId, setClaimingLevelId] = useState<string | null>(null);
  const setHeaderColor = useUIStore((state) => state.setHeaderColor);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchLevels(), fetchMyLevel()])
      .then(([levelsRes, meRes]) => {
        if (cancelled) return;
        const sorted = [...levelsRes].sort((a, b) => a.order - b.order);
        setLevels(sorted);
        setMe(meRes);
        const idx = meRes.currentLevel
          ? sorted.findIndex((l) => l.id === meRes.currentLevel!.id)
          : -1;
        setActiveIndex(idx >= 0 ? idx : 0);
      })
      .catch((err) => {
        console.warn("Failed to load level data:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Restore browser chrome color ke default pas keluar dari halaman ini —
  // cuma di-capture sekali biar gak ketiban warna level terakhir yang aktif.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    const original = meta?.getAttribute("content") ?? null;
    return () => {
      if (meta && original) meta.setAttribute("content", original);
    };
  }, []);

  // Samain warna browser chrome (address bar/status bar) sama hero level
  // yang lagi aktif — cuma di mobile web, desktop gak kepengaruh theme-color.
  useEffect(() => {
    if (levels.length === 0) return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const theme = LEVEL_THEMES[activeIndex % LEVEL_THEMES.length];
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.heroColor);
  }, [activeIndex, levels.length]);

  // Samain warna Header app (logo+avatar) sama hero level yang lagi aktif —
  // berlaku di semua viewport, beda dari meta theme-color yang cuma mobile.
  useEffect(() => {
    if (levels.length === 0) return;
    const theme = LEVEL_THEMES[activeIndex % LEVEL_THEMES.length];
    setHeaderColor(theme.heroColor);
  }, [activeIndex, levels.length, setHeaderColor]);

  useEffect(() => {
    return () => setHeaderColor(null);
  }, [setHeaderColor]);

  const goToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(levels.length - 1, index));
    if (clamped === activeIndex) return;
    setDirection(clamped > activeIndex ? 1 : -1);
    setActiveIndex(clamped);
  };

  const handleSwipe = (info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      goToIndex(activeIndex + 1);
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      goToIndex(activeIndex - 1);
    }
  };

  const handleClaim = async (levelId: string) => {
    setClaimingLevelId(levelId);
    try {
      await claimLevelReward(levelId);
      toast.success("Reward berhasil diklaim! 🎉");
      const freshMe = await fetchMyLevel();
      setMe(freshMe);
      // Reward bisa nambah kuota (freeScanCount dll) yang ditampilkan di
      // tempat lain (mis. home) lewat authStore — sinkronkan sekalian.
      await getCurrentUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal klaim reward");
    } finally {
      setClaimingLevelId(null);
    }
  };

  return (
    <div className="relative left-1/2 -mt-4 w-screen -translate-x-1/2 space-y-3 lg:left-0 lg:mt-0 lg:w-full lg:translate-x-0">
      {loading ? (
        <LevelPageSkeleton />
      ) : levels.length === 0 ? (
        <div className="rounded-xl border border-border/60 p-6 text-center text-sm text-muted-foreground">
          Belum ada level yang tersedia.
        </div>
      ) : (
        <LevelStage
          level={levels[activeIndex]}
          levels={levels}
          direction={direction}
          total={levels.length}
          activeIndex={activeIndex}
          currentLevelOrder={me?.currentLevel?.order ?? null}
          onDotClick={goToIndex}
          onSwipe={handleSwipe}
          status={getStatus(levels[activeIndex], me)}
          stats={me?.stats ?? null}
          achievement={
            me?.achievements.find((a) => a.levelId === levels[activeIndex].id) ?? null
          }
          isClaiming={claimingLevelId === levels[activeIndex].id}
          onClaim={handleClaim}
        />
      )}
    </div>
  );
}
