export type LevelMetric = "splitCount" | "totalAmount" | "friendCount";
export type LevelOperator = "=" | ">" | "<" | ">=" | "<=";

export interface LevelRule {
  metric: LevelMetric;
  operator: LevelOperator;
  value: number;
}

export interface UserLevel {
  id: string;
  name: string;
  icon: string;
  order: number;
  description: string;
  benefits: string[];
  rules: LevelRule[];
  isActive: boolean;
}

export interface UserLevelStats {
  splitCount: number;
  totalAmount: number;
  friendCount: number;
}

// Harus sinkron dengan BENEFIT_TYPE_VALUES di splitbill-be/lib/levelRewards.js
export type LevelBenefitType = "free_scan_ai" | "max_split_bill";

export interface LevelReward {
  benefitType: LevelBenefitType;
  amount: number;
}

// Satu baris achievement = user pernah mencapai satu level tertentu.
// Sekali dibuat backend, gak pernah hilang walau level user turun lagi —
// jadi status `claimed` di sini adalah sumber kebenaran final buat tombol klaim.
export interface LevelAchievement {
  levelId: string;
  achievedAt: string;
  claimed: boolean;
  claimedAt: string | null;
  rewardsSnapshot: LevelReward[];
}

export interface UserLevelMeResponse {
  stats: UserLevelStats;
  currentLevel: UserLevel | null;
  nextLevel: UserLevel | null;
  achievements: LevelAchievement[];
}
