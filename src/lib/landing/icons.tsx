import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  Gift,
  Heart,
  Lock,
  MessageCircle,
  PiggyBank,
  Plane,
  Receipt,
  ScanLine,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { createElement } from "react";

// Static map (not lucide's dynamic loader) so only these icons ship in the
// homepage bundle. Must match LANDING_ICONS in splitbill-be lib/landingPage.js.
const LANDING_ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  Gift,
  Heart,
  Lock,
  MessageCircle,
  PiggyBank,
  Plane,
  Receipt,
  ScanLine,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wallet,
  Zap,
};

interface LandingIconProps extends LucideProps {
  name: string | undefined;
  fallback?: LucideIcon;
}

/** Renders a CMS icon by name. Unknown names (e.g. an icon allowed in the CMS before the web knows it) fall back instead of crashing the render. */
export function LandingIcon({ name, fallback = Sparkles, ...props }: LandingIconProps) {
  return createElement((name && LANDING_ICONS[name]) || fallback, props);
}
