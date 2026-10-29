import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatToIDR } from "@/lib/utils";
import { RichText } from "@/lib/landing/RichText";
import { LandingEyebrow } from "./LandingEyebrow";
import { getTone } from "@/lib/landing/tones";
import { isUnoptimizableSrc } from "@/lib/landing/image";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

// Worked example shown next to the tax copy, styled as a receipt: 4 people,
// service 5% then tax 10% on (subtotal + service). "Kamu" ordered the least.
// Only the subtotal and "Kamu" are printed; the rest just feed the math.
const ORDERS = [
  { name: "Andi", amount: 150_000 },
  { name: "Budi", amount: 120_000 },
  { name: "Cici", amount: 80_000 },
  { name: "Kamu", amount: 50_000 },
];
const subtotal = ORDERS.reduce((sum, o) => sum + o.amount, 0);
const service = subtotal * 0.05;
const tax = (subtotal + service) * 0.1;
const total = subtotal + service + tax;
const yours = ORDERS.find((o) => o.name === "Kamu")!.amount;
const evenShare = yours + (service + tax) / ORDERS.length;
const proportionalShare = yours * (total / subtotal);

// Scalloped top/bottom edges for the receipt paper
const receiptEdgeMask =
  "radial-gradient(circle at 8px 0, transparent 6px, #000 6.5px) top / 16px 51% repeat-x, " +
  "radial-gradient(circle at 8px 100%, transparent 6px, #000 6.5px) bottom / 16px 51% repeat-x";

/**
 * Server-rendered explainer below the feature cards: real use cases plus how
 * tax and service charge are split. Passed into HomepagePageClient as a slot
 * so the copy is plain HTML, not part of the client bundle. Header and cards
 * come from the CMS; the tax explainer below stays static.
 */
export function UseCasesSection({ content }: { content: LandingContent["useCases"] }) {
  return (
    <section data-landing-section="useCases" className="relative py-16 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          {content.eyebrow && (
            <LandingEyebrow className="mb-5">{content.eyebrow}</LandingEyebrow>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            <LandingTitle title={content.title} highlight={content.titleHighlight} />
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg text-slate-500 font-medium">
              <RichText text={content.subtitle} />
            </p>
          )}
        </div>

        {/* Use case cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {content.cards.map((uc, idx) => (
            <Link
              key={idx}
              href={uc.href}
              className="group flex md:flex-col bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.18)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Tinted image panel inset from the card edges, flush with the copy —
                  same treatment as the feature showcase cards */}
              <div className="shrink-0 pl-3 py-3 md:px-4 md:pt-4 md:pb-0">
              <div className={`relative w-20 h-full md:w-auto md:h-40 rounded-tl-lg rounded-bl-lg md:rounded-bl-none md:rounded-tr-lg overflow-hidden bg-gradient-to-br ${getTone(uc.tone).tint} flex items-center justify-center`}>
                {uc.feature && (
                  <span className="hidden md:inline-block absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]">
                    {uc.feature}
                  </span>
                )}
                <Image
                  src={uc.imageUrl}
                  unoptimized={isUnoptimizableSrc(uc.imageUrl)}
                  alt=""
                  width={128}
                  height={128}
                  sizes="128px"
                  className="w-14 h-14 md:w-28 md:h-28 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>
              </div>
              <div className="flex flex-col flex-1 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-black text-slate-800 mb-1.5 md:mb-2">{uc.title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-3 md:mb-5">{uc.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {uc.ctaLabel}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Tax & service charge explainer + worked example */}
        <div className="mt-8 sm:mt-10 bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] overflow-hidden px-4 pt-4 sm:px-8 sm:pt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* No bottom padding on the card: the receipt panel sits flush with its bottom edge
              (like the feature showcase image panels), so the copy carries its own on desktop */}
          <div className="px-1 pt-1 sm:px-0 sm:pt-0 lg:pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/img/cara-pakai/split-bill/tax.png"
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="w-14 h-14 object-contain"
              />
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                Pajak dan service charge dihitung otomatis
              </h3>
            </div>
            <div className="space-y-4 text-base text-slate-600 font-medium leading-relaxed">
              <p>
                Masukin pajak restoran (PPN) dan service charge sekali aja, SplitBill yang bagi ke
                semua orang. Kamu bisa pilih dibagi rata, atau proporsional sesuai total pesanan
                masing-masing. Jadi yang pesan sedikit gak ikut nanggung pajak pesanan orang lain,
                gak ada lagi drama selisih seribu dua ribu.
              </p>
              <p>
                Hasilnya langsung bisa kamu share ke grup WhatsApp, lengkap dengan rincian per orang
                dan siapa transfer ke siapa.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/split-bill"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                Mulai split bill sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/split-bill/cara-pakai"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-primary/15 text-primary font-bold text-sm hover:bg-primary/5 transition-all"
              >
                Baca panduan cara pakainya
              </Link>
            </div>
          </div>

          {/* Worked example, styled as a receipt */}
          <div className="self-stretch rounded-t-2xl md:rounded-t-3xl bg-gradient-to-br from-primary/10 to-primary/[0.03] px-4 py-6 sm:px-8 flex items-center justify-center">
            <div className="w-full max-w-sm drop-shadow-[0_10px_20px_rgba(15,23,42,0.10)] lg:rotate-1">
              <div
                className="bg-white px-5 pt-6 pb-7 font-mono text-[12px] text-slate-600"
                style={{ mask: receiptEdgeMask, WebkitMask: receiptEdgeMask }}
              >
                <p className="text-center font-bold text-slate-800 tracking-widest">
                  WARUNG NONGKRONG
                  <span className="block text-[10px] font-normal tracking-normal text-slate-400">
                    Contoh: makan berempat
                  </span>
                </p>

                <div className="border-t border-dashed border-slate-300 my-3" />

                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt>Subtotal ({ORDERS.length} orang)</dt>
                    <dd>{formatToIDR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Service 5% + Pajak 10%</dt>
                    <dd>{formatToIDR(service + tax)}</dd>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <dt>TOTAL</dt>
                    <dd>{formatToIDR(total)}</dd>
                  </div>
                </dl>

                <div className="border-t border-dashed border-slate-300 my-3" />

                <div className="flex justify-between font-bold text-slate-800">
                  <span>Pesanan kamu</span>
                  <span>{formatToIDR(yours)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-md border border-dashed border-slate-200 px-3 py-2 text-slate-400">
                    <p className="text-[10px]">Bagi rata</p>
                    <p className="line-through">{formatToIDR(evenShare)}</p>
                  </div>
                  <div className="relative rounded-md bg-primary/5 border border-dashed border-primary/40 px-3 py-2 text-primary font-bold">
                    <p className="text-[10px] font-medium">Proporsional</p>
                    <p className="text-sm">{formatToIDR(proportionalShare)}</p>
                    <span className="absolute -top-2.5 right-2 bg-emerald-500 text-white text-[9px] font-sans font-black px-1.5 py-0.5 rounded-full">
                      Lebih adil
                    </span>
                  </div>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-3">
                  Kamu hemat {formatToIDR(evenShare - proportionalShare)}. Makasih, sampai patungan lagi!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
