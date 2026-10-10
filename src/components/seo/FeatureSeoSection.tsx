import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import type { FeatureSeoContent } from "@/data/featureSeoContent";
import { cn } from "@/lib/utils";

const cardClass =
  "bg-white rounded-md border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]";

function SectionHeading({
  prefix,
  highlight,
  gradient = "from-primary to-blue-600",
  subtitle,
}: {
  prefix: string;
  highlight: string;
  gradient?: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-6">
      <h2
        className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight text-balance mb-3"
      >
        {prefix}{" "}
        <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", gradient)}>{highlight}</span>
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Server-rendered explainer for interactive tool pages (split-bill, invoice,
 * collect-money, shared-goals). Same 600px column as the tool, styled like
 * the /[fitur]/cara-pakai pages. The tools are client-only and render a
 * loading shell on the server, so this is the text crawlers actually index.
 * Pages place it first in the DOM and push it visually below the tool with
 * `order-*`, so the tool stays the first thing users see.
 */
export function FeatureSeoSection({
  titlePrefix,
  titleHighlight,
  logo,
  lead,
  points,
  stepsTitleHighlight,
  stepsSubtitle,
  steps,
  guideHref,
  guideLabel,
  featureName,
  faqs,
  heroImage,
  ctaTitle,
  ctaHighlight,
  ctaIcon: CtaIcon,
  ctaLabel,
  className,
}: FeatureSeoContent & { className?: string }) {
  return (
    <section
      aria-labelledby="feature-seo-title"
      className={cn("w-full bg-background flex justify-center border-t border-slate-100", className)}
    >
      <div className="w-full max-w-[600px] px-4 pt-12 pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pb-20 space-y-14">
        {/* Overview, carries the page H1: feature logo left, text left-aligned */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md bg-white border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.12)] flex items-center justify-center p-2.5 shrink-0">
                <Image src={logo} alt="" width={96} height={96} sizes="96px" className="w-full h-full object-contain" />
              </div>
              <h1
                id="feature-seo-title"
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight"
              >
                {titlePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  {titleHighlight}
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{lead}</p>
          </div>
          <div className="space-y-3">
            {points.map((point) => (
              <div key={point.title} className={cn(cardClass, "flex gap-4 p-4 sm:p-5")}>
                <div className="w-11 h-11 bg-primary rounded-md flex items-center justify-center p-2.5 shrink-0">
                  <point.icon className="w-full h-full text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 mb-1">{point.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick steps */}
        <div>
          <SectionHeading
            prefix="Cara Cepat"
            highlight={stepsTitleHighlight}
            gradient="from-violet-600 to-primary"
            subtitle={stepsSubtitle}
          />
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className={cn(cardClass, "relative flex items-center gap-4 p-4 overflow-hidden")}>
                <div className="w-11 h-11 bg-primary/10 rounded-md flex items-center justify-center p-2.5 shrink-0">
                  <step.icon className="w-full h-full text-primary" strokeWidth={1.75} />
                </div>
                <div className="flex-1 pr-12">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800">{step.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{step.description}</p>
                </div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl font-black text-primary/10 leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
          {guideHref && (
            <Link
              href={guideHref}
              className="group mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-md border border-primary/20 bg-white text-primary font-bold text-sm hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              {guideLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* FAQ (native <details>: answers stay in the server HTML) */}
        {faqs.length > 0 && (
          <div>
            <SectionHeading
              prefix="Pertanyaan Seputar"
              highlight={featureName}
              subtitle="Yang paling sering ditanyain soal fitur ini."
            />
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.id} className={cn(cardClass, "group overflow-hidden open:border-primary/20")}>
                  <summary className="list-none [&::-webkit-details-marker]:hidden px-5 py-4 flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-base font-bold text-slate-800 hover:text-primary group-open:text-primary transition-colors">
                    {faq.question}
                    <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 transition-all group-open:bg-primary group-open:text-white group-open:shadow-md group-open:shadow-primary/20">
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 pt-1 text-sm font-semibold text-slate-500 leading-relaxed border-t border-slate-50">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
            <Link
              href="/faq"
              className="group mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              Lihat semua pertanyaan
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Closing banner back up to the tool, styled like the
            /split-bill-liburan product banner */}
        <div className="relative overflow-hidden rounded-md bg-primary">
          {/* Fine grid, same pattern as the liburan banner */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff14 1px, transparent 1px), linear-gradient(90deg, #ffffff14 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 80%)",
            }}
          />
          {/* Landscape on every width: product mockup left (bottom-anchored), compact copy right */}
          <div className="relative z-10 grid grid-cols-[55fr_45fr] sm:grid-cols-2 gap-2 sm:gap-5">
            <div className="relative">
              {/* Cara-pakai hero illustration. Mobile: fills the column at the
                  card's full height (center-cropped). sm+: wider than its column
                  (it has empty margins left/right), anchored to the top edge */}
              <Image
                src={heroImage}
                alt=""
                width={1920}
                height={900}
                sizes="(max-width: 600px) 60vw, 400px"
                className="absolute inset-0 w-full h-full object-cover object-center sm:inset-auto sm:top-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[140%] sm:max-w-none sm:h-auto"
              />
            </div>
            <div className="relative z-10 py-5 pr-4 sm:py-7 sm:pr-6">
              <p className="text-base sm:text-xl font-black text-white tracking-tight leading-tight mb-4">
                {ctaTitle} <span className="text-blue-100">{ctaHighlight}</span>
              </p>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2.5 sm:px-5 sm:py-3 rounded-md bg-white text-primary font-black text-xs sm:text-sm shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
              >
                <CtaIcon className="hidden sm:block w-4 h-4" />
                {ctaLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
