"use client";

import React from "react";
import { formatToIDR } from "@/lib/utils";
import {
  Users,
  ReceiptText,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  SplitBillData,
  BillBalances,
  SettlementInstruction,
  BillItem,
} from "@/hooks/useBillCalculations";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/store/useWalletStore";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=128&scale=100&seed=";

interface SocialSplitBillReceiptProps {
  data: SplitBillData & {
    activityName: string;
    totalSpent: number;
    settlementInstructions: SettlementInstruction[];
    balances: BillBalances;
    badges: Record<string, string[]>;
    selectedMethods?: PaymentMethod[];
  };
}

export const SocialSplitBillReceipt = React.forwardRef<
  HTMLDivElement,
  SocialSplitBillReceiptProps
>(({ data }, ref) => {
  const {
    activityName,
    totalSpent,
    settlementInstructions,
    balances,
    badges,
    selectedMethods = [],
  } = data;
  const people = Object.keys(balances);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "💳";
      case "Si Paling Sultan":
        return "👑";
      case "Si Paling Irit":
        return "🍃";
      default:
        return "✨";
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Si Paling Sultan":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Si Paling Irit":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-primary/5 text-primary border-primary/10";
    }
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={ref}
      className="w-[1080px] bg-white p-16 min-h-[1080px] font-sans relative overflow-hidden flex flex-col items-center"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-slate-50 z-0 rounded-b-[100px] border-b border-slate-100" />
      <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl z-0" />
      <div className="absolute top-[800px] left-[-200px] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl z-0" />

      {/* Branding */}
      <div className="relative z-10 w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-primary/5 p-3">
            <img
              src="/img/footer-icon.png"
              alt="SplitBill Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h4 className="text-primary text-4xl font-black italic tracking-tighter leading-none">
              SPLITBILL
            </h4>
            <p className="text-slate-500 text-xl font-bold uppercase tracking-widest mt-1">
              Social Bill Summary
            </p>
          </div>
        </div>
        <div className="px-8 py-3 bg-primary/10 backdrop-blur-md rounded-full border border-primary/10">
          <span className="text-primary text-2xl font-bold">
            #SplitBillGakPakeRibet
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-10">
        <div className="mb-8 relative">
          <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center relative z-10 overflow-hidden border-4 border-primary/10">
            <ReceiptText className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-40 animate-pulse rounded-full" />
        </div>
        <h1 className="text-slate-900 text-6xl font-black tracking-tight mb-4 max-w-[900px]">
          {activityName || "Laporan Keuangan Tongkrongan"}
        </h1>
        <div className="flex items-center gap-4 text-slate-500 text-2xl font-bold uppercase tracking-widest">
          <Calendar className="w-7 h-7 text-primary" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="relative z-10 w-full bg-white rounded-[50px] border border-primary/5 p-8 mt-8 flex flex-col gap-10">
        <div className="flex justify-between items-center py-10 px-10 bg-primary/5 rounded-[30px] border border-primary/10">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-2xl font-black uppercase tracking-widest opacity-60">
              Total Bill
            </span>
            <span className="text-7xl font-black text-primary tracking-tighter">
              {formatToIDR(totalSpent)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-slate-500 text-2xl font-bold uppercase tracking-widest">
              Members
            </span>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-6xl font-black text-slate-800">
                {
                  people.filter(
                    (name) =>
                      balances[name].paid > 0 || balances[name].spent > 0,
                  ).length
                }
              </span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Hall of Fame ✨
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {people.map((name) => {
              const personBadges = badges[name] || [];
              if (personBadges.length === 0) return null;

              return (
                <div
                  key={name}
                  className="flex items-center gap-5 p-6 bg-slate-50 rounded-[30px] border border-slate-100 transition-all hover:scale-105"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shrink-0">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                      alt={name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-2xl font-bold text-slate-800 truncate">
                      {name}
                    </span>
                    <div className="flex flex-nowrap gap-2 overflow-hidden">
                      {personBadges.map((badge) => (
                        <span
                          key={badge}
                          className={`text-lg font-black px-4 py-1.5 rounded-full border whitespace-nowrap shrink-0 ${getBadgeColor(badge)}`}
                        >
                          {getBadgeIcon(badge)} {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rincian Per Orang Section */}
      <div className="relative z-10 w-full mt-16 px-4">
        <h3 className="text-3xl font-black text-slate-800 mb-10 flex items-center gap-4">
          <Users className="w-8 h-8 text-primary" />
          Rincian Per Orang 📊
        </h3>
        <div className="flex flex-col gap-8 w-full">
          {people
            .filter((name) => {
              const b = balances[name];
              return b.paid > 0 || b.spent > 0;
            })
            .map((name) => {
              const b = balances[name];
              const diff = b.spent - b.paid;
              const isOwed = diff < 0;

              return (
                <div
                  key={name}
                  className="flex flex-col gap-10 p-8 bg-white border border-slate-100 rounded-[50px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shrink-0">
                        <img
                          src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                          alt={name}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-5xl font-black text-slate-800 tracking-tight">
                          {name}
                        </p>
                        <div className="flex items-center gap-6 text-2xl font-bold text-slate-400">
                          <p>
                            Bayar:{" "}
                            <span className="text-slate-600">
                              {formatToIDR(b.paid)}
                            </span>
                          </p>
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                          <p>
                            Beban:{" "}
                            <span className="text-slate-600">
                              {formatToIDR(b.spent)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-[16px] font-black uppercase tracking-widest px-6 py-2 rounded-full inline-block mb-2 border",
                          diff === 0
                            ? "bg-slate-50 text-slate-400 border-slate-100"
                            : isOwed
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-destructive/5 text-destructive border-destructive/10",
                        )}
                      >
                        {diff === 0 ? "Lunas" : isOwed ? "Terima" : "Bayar"}
                      </p>
                      <p
                        className={cn(
                          "text-5xl font-black tracking-tighter",
                          diff === 0
                            ? "text-slate-400"
                            : isOwed
                              ? "text-emerald-600"
                              : "text-destructive",
                        )}
                      >
                        {formatToIDR(Math.abs(diff))}
                      </p>
                    </div>
                  </div>

                  {/* Person's Items */}
                  {b.items.length > 0 && (
                    <div className="bg-slate-50/50 rounded-[35px] p-8 flex flex-col gap-6">
                      <p className="text-[18px] font-black uppercase text-slate-400 tracking-widest pl-2">
                        Item Terdaftar:
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        {b.items.map((item: BillItem, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start gap-6 text-3xl py-1.5"
                          >
                            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                              <span className="text-slate-600 font-bold">
                                {item.name}
                              </span>
                              {item.share < 0 && (
                                <span className="text-[14px] font-black uppercase px-3 py-1 rounded bg-destructive/10 text-destructive border border-destructive/5">
                                  Disc
                                </span>
                              )}
                              {item.isAdditional && (
                                <span
                                  className={cn(
                                    "text-[14px] font-black uppercase px-3 py-1 rounded border",
                                    item.method === "prop"
                                      ? "bg-primary/5 text-primary border-primary/20"
                                      : "bg-slate-200 text-slate-500 border-slate-300",
                                  )}
                                >
                                  {item.method === "prop" ? "% Prop" : "= Rata"}
                                </span>
                              )}
                            </div>
                            <span className="font-black text-slate-700 shrink-0 whitespace-nowrap pt-1">
                              {formatToIDR(item.share)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Transfer & Payment Info Section */}
      <div className="relative z-10 w-full mt-16 px-4">
        <div className="flex flex-col gap-10">
          {/* Instructions */}
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4">
              <ArrowRight className="w-8 h-8 text-primary" />
              Transfer Ke Sini Ya! 💸
            </h3>
            <div className="grid grid-cols-1 gap-5">
              {settlementInstructions.length > 0 ? (
                settlementInstructions.map((inst, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 rounded-[35px] p-8 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative flex items-center shrink-0">
                        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
                          <img
                            src={`${AVATAR_BASE_URL}${encodeURIComponent(inst.from)}`}
                            alt={inst.from}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-[-8px] z-10 border-2 border-slate-50">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
                          <img
                            src={`${AVATAR_BASE_URL}${encodeURIComponent(inst.to)}`}
                            alt={inst.to}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-2xl font-bold text-slate-600">
                          <span className="text-destructive font-black underline decoration-destructive/20 underline-offset-4">
                            {inst.from}
                          </span>
                          {" bayar ke "}
                          <span className="text-emerald-600 font-black underline decoration-emerald-600/20 underline-offset-4">
                            {inst.to}
                          </span>
                        </p>
                        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                          Settlement Order
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-3xl font-black text-primary">
                        {formatToIDR(inst.amount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                  <p className="text-3xl font-black text-slate-400">
                    Gak ada yang perlu ditransfer! 🎉
                  </p>
                  <p className="text-xl font-bold text-slate-400 mt-2">
                    Semua orang sudah lunas/impas.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          {selectedMethods.length > 0 && (
            <div className="space-y-8 mt-6">
              <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-primary" />
                Detail Rekening Pembayaran 📥
              </h3>
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[50px] border border-slate-100">
                {selectedMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-6 bg-white border border-slate-100 rounded-[35px] flex items-center gap-8"
                  >
                    <div className="w-24 h-24 p-4 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shrink-0">
                      {[
                        "bca",
                        "bni",
                        "bri",
                        "mandiri",
                        "dana",
                        "gopay",
                        "ovo",
                        "shopeepay",
                        "jenius",
                        "linkaja",
                        "permata",
                        "danamon",
                        "bsi",
                        "btn",
                        "bank jago",
                        "seabank",
                      ].some((kw) =>
                        method.providerName.toLowerCase().includes(kw),
                      ) ? (
                        <img
                          src={`/img/logo-${method.providerName.toLowerCase()}.png`}
                          alt={method.providerName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/img/footer-icon.png";
                          }}
                        />
                      ) : (
                        <div className="text-primary/40 font-black text-2xl uppercase">
                          {method.providerName.slice(0, 3)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-lg font-black text-primary uppercase tracking-wider leading-none mb-1">
                        {method.providerName}
                      </p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight leading-none py-1 break-all">
                        {method.accountNumber || method.phoneNumber}
                      </p>
                      <p className="text-xl font-bold text-slate-400 mt-1 truncate">
                        a.n. {method.accountName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Brand */}
      <div className="relative z-10 mt-auto pt-24 pb-8 text-center w-full">
        <div className="w-full h-px bg-slate-100 mb-10" />
        <p className="text-slate-600 text-2xl font-bold">
          Dihitung otomatis dengan cinta oleh{" "}
          <span className="text-primary font-black">SplitBill</span>
        </p>
        <p className="text-primary font-black text-3xl mt-3 tracking-tighter">
          www.splitbill.my.id
        </p>
      </div>
    </div>
  );
});

SocialSplitBillReceipt.displayName = "SocialSplitBillReceipt";
