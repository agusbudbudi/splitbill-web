import { formatToIDR } from "@/lib/utils";
import type { LevelRule, UserLevelStats } from "@/lib/types/level";

export const LEVEL_METRIC_LABELS: Record<LevelRule["metric"], string> = {
  splitCount: "split bill",
  totalAmount: "total nominal",
  friendCount: "teman",
};

export function formatRuleValue(rule: LevelRule): string {
  return rule.metric === "totalAmount"
    ? formatToIDR(rule.value)
    : `${rule.value}`;
}

export function formatRuleSentence(rule: LevelRule): string {
  return `${LEVEL_METRIC_LABELS[rule.metric]} ${rule.operator} ${formatRuleValue(rule)}`;
}

export interface RuleProgress {
  rule: LevelRule;
  remaining: number;
  percent: number;
}

export interface LevelTheme {
  bg: string;
  soft: string;
  badgeSoft: string;
  text: string;
  badge: string;
  accent: string;
  accentSoft: string;
  /** Hex value of `accent`, buat dipakai di tempat yang butuh warna mentah (mis. meta theme-color). */
  heroColor: string;
}

// Palet warna per level (urutan order asc: Newbie → Rajin → Jago → Sultan).
// Dipakai bareng antara LevelDetailPanel (halaman /member/level) dan
// MyLevelCard (entry point di /profile), jadi warnanya konsisten.
export const LEVEL_THEMES: LevelTheme[] = [
  {
    // Newbie — Soft Blue
    bg: "from-[#EAF6FF] to-[#B9E0FF]",
    soft: "bg-[#EAF6FF]",
    badgeSoft: "bg-[#D9EDFF]",
    text: "text-[#12345B]",
    badge: "bg-[#489FEA]",
    accent: "bg-[#72B9F5]",
    accentSoft: "bg-[#72B9F5]/30",
    heroColor: "#72B9F5",
  },
  {
    // Rajin Patungan — Vibrant Blue
    bg: "from-[#DDF1FF] to-[#8FCBFF]",
    soft: "bg-[#DDF1FF]",
    badgeSoft: "bg-[#C7E8FF]",
    text: "text-[#102F52]",
    badge: "bg-[#2F8FE5]",
    accent: "bg-[#489FEA]",
    accentSoft: "bg-[#489FEA]/30",
    heroColor: "#489FEA",
  },
  {
    // Jago Patungan — Purple
    bg: "from-[#F0EDFF] to-[#BEB6FF]",
    soft: "bg-[#F0EDFF]",
    badgeSoft: "bg-[#E1DBFF]",
    text: "text-[#28204F]",
    badge: "bg-[#6758E8]",
    accent: "bg-[#7C6FF2]",
    accentSoft: "bg-[#7C6FF2]/30",
    heroColor: "#7C6FF2",
  },
  {
    // Sultan Patungan — Gold
    bg: "from-[#FFF8DE] to-[#FFD66B]",
    soft: "bg-[#FFF8DE]",
    badgeSoft: "bg-[#FFEFB0]",
    text: "text-[#4D3600]",
    badge: "bg-[#E5A51C]",
    accent: "bg-[#F5B93D]",
    accentSoft: "bg-[#F5B93D]/30",
    heroColor: "#F5B93D",
  },
];

// Fallback kalau level.icon dari backend kosong — belum ada mascot art per
// level, jadi sementara semua level pakai icon generic app biar gak broken image.
export const LEVEL_ICONS = [
  "/img/split-bill-icon.png",
  "/img/split-bill-icon.png",
  "/img/split-bill-icon.png",
  "/img/split-bill-icon.png",
];

// Seed data pakai order 1-indexed (Newbie = 1), jadi order - 1 = posisi
// array tema/icon.
export function getLevelThemeIndex(order: number): number {
  const idx = order - 1;
  return idx >= 0 && idx < LEVEL_THEMES.length ? idx : 0;
}

// Progress cuma dihitung buat rule dengan arah "naik" (>, >=) — sesuai PRD
// member-level-page §3.4. Rule <, <=, = biasanya kriteria starter/tier-bawah,
// bukan target buat naik level, jadi di-exclude dari progress bar.
export function computeAchievableProgress(
  rules: LevelRule[],
  stats: UserLevelStats,
): RuleProgress[] {
  return rules
    .filter((rule) => rule.operator === ">" || rule.operator === ">=")
    .map((rule) => {
      const actual = stats[rule.metric];
      const needed = rule.operator === ">" ? rule.value + 1 : rule.value;
      const remaining = Math.max(0, needed - actual);
      const percent = needed > 0 ? Math.min(100, Math.round((actual / needed) * 100)) : 100;
      return { rule, remaining, percent };
    });
}
