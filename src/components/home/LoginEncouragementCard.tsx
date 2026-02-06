"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

export const LoginEncouragementCard = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Card className="rounded-[1.2rem] bg-white/80 backdrop-blur-xs text-card-foreground border-none shadow-soft overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 pointer-events-none">
        <LogIn className="w-32 h-32" />
      </div>

      <CardContent className="p-5 flex items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-sm">
            Simpan data kamu
          </h3>
          <p className="text-xs text-muted-foreground font-medium max-w-[200px] leading-relaxed">
            Login untuk menyimpan riwayat split bill dan akses dari perangkat
            mana saja.
          </p>
        </div>

        <Link href="/login">
          <Button
            size="sm"
            className="h-9 px-4 rounded-xl shadow-lg shadow-primary/20"
          >
            Masuk
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
