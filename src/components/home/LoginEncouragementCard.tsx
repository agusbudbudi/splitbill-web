import { LogIn, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const LoginEncouragementCard = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Card className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/50 shadow-soft overflow-hidden">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Compact Icon */}
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
          <LogIn className="w-5 h-5 text-primary" />
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-0.5">
          <h3 className="font-bold text-foreground text-[13px] tracking-tight flex items-center gap-1.5">
            Simpan Data Otomatis <Sparkles className="w-3 h-3 text-amber-500" />
          </h3>
          <p className="text-[10.5px] text-muted-foreground font-medium leading-tight">
            Login biar riwayat split bill kamu aman & bisa diakses di mana saja.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/login">
          <Button
            size="sm"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 font-bold text-xs"
          >
            Masuk
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
