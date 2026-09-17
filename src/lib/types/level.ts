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

export interface UserLevelMeResponse {
  stats: UserLevelStats;
  currentLevel: UserLevel | null;
  nextLevel: UserLevel | null;
}
