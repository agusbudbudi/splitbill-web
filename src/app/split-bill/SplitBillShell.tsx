"use client";

import { CheckSquare, PenLine, ReceiptText, Users, Users2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StepperV2 } from "@/components/splitbill/StepperV2";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getFriendAvatarUrl } from "@/lib/utils";

// Same defaults as ParticipantsFormCard
const SUGGESTIONS = ["Gua", "Temen 1", "Temen 2"];

const steps = [
  { id: 1, label: "Input Teman", icon: Users },
  { id: 2, label: "Input Bill", icon: ReceiptText },
  { id: 3, label: "Input Detail", icon: PenLine },
  { id: 4, label: "Hasil Beres", icon: CheckSquare },
];

/**
 * Static step-1 shell for the split-bill wizard, used as its <Suspense>
 * fallback. The wizard reads useSearchParams and persisted stores, so it only
 * renders after hydration; without this the server HTML is a lone spinner and
 * LCP waits for all of the page's JS. Mirrors the empty step-1 layout of
 * SplitBillClientPage + ParticipantsFormCard so the swap is seamless.
 */
export function SplitBillShell() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Header title="Split Bill" showBackButton sticky className="rounded-b-none shadow-none" />

      <div className="relative w-full max-w-[600px] flex-1 flex flex-col">
        <div className="relative z-20">
          <StepperV2 steps={steps} currentStep={1} />
        </div>

        <main className="relative z-10 w-full px-4 pt-4 pb-8 space-y-8">
          <div>
            <div className="flex flex-col items-start text-left gap-1 mb-3">
              <h2 className="text-lg font-bold text-foreground">Siapa aja nih?</h2>
              <p className="text-muted-foreground text-xs max-w-[360px]">
                Tambahkan minimal 2 teman untuk mulai split bill.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="shadow-md">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-foreground px-1">Tambah Teman</p>
                    <div>
                      <Input
                        type="text"
                        readOnly
                        placeholder="Cari teman atau tambah teman baru..."
                        className="h-12"
                        aria-label="Tambah teman"
                      />
                      <p className="text-[11px] text-muted-foreground/70 px-1 pt-1.5">
                        Cari dari daftar teman tersimpan atau tekan Enter untuk menambahkan teman baru.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((name) => (
                      <span
                        key={name}
                        className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary/80 border border-primary/10 shadow-soft"
                      >
                        <img
                          src={getFriendAvatarUrl(name)}
                          alt={name}
                          className="w-6 h-6 rounded-full border-1 border-white bg-white shadow-sm"
                        />
                        <span>+ {name}</span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-bold text-foreground">Peserta Split Bill</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary">
                    0 Teman / min. 2
                  </span>
                </div>
                <div className="p-4 rounded-sm border-1 border-dashed bg-muted/5 border-muted-foreground/10 min-h-[140px] flex flex-col items-center justify-center gap-2 text-center">
                  <Users2 className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm font-bold text-foreground/70">Belum ada teman</p>
                  <p className="text-xs text-muted-foreground">Yuk tambah minimal 2 teman!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="sticky bottom-0 w-full z-50 flex justify-center mt-auto">
        <div className="w-full max-w-[600px] bg-background px-4 pb-4 pb-safe">
          <div className="w-full h-14 rounded-sm bg-primary/10 text-primary text-lg font-bold flex items-center justify-center opacity-80">
            Tambah 2 Orang Lagi
          </div>
        </div>
      </div>
    </div>
  );
}
