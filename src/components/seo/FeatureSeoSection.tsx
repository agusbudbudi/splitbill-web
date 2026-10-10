import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, ChevronDown } from "lucide-react";
import type { FeatureSeoContent } from "@/data/featureSeoContent";
import { cn } from "@/lib/utils";

const cardClass =
  "bg-white rounded-md border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]";

function SectionHeading({
  as: Tag = "h2",
  prefix,
  highlight,
  gradient = "from-primary to-blue-600",
  subtitle,
  id,
}: {
  as?: "h1" | "h2";
  prefix: string;
  highlight: string;
  gradient?: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div className="text-center mb-6">
      <Tag
        id={id}
        className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight text-balance mb-3"
      >
        {prefix}{" "}
        <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", gradient)}>{highlight}</span>
      </Tag>
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
  lead,
  points,
  stepsTitleHighlight,
  stepsSubtitle,
  steps,
  guideHref,
  guideLabel,
  featureName,
  faqs,
  ctaTitle,
  ctaLabel,
  className,
}: FeatureSeoContent & { className?: string }) {
  return (
    <section
      aria-labelledby="feature-seo-title"
      className={cn("w-full bg-background flex justify-center border-t border-slate-100", className)}
    >
      <div className="w-full max-w-[600px] px-4 pt-12 pb-20 space-y-14">
        {/* Overview, carries the page H1 */}
        <div>
          <SectionHeading
            as="h1"
            id="feature-seo-title"
            prefix={titlePrefix}
            highlight={titleHighlight}
            subtitle={lead}
          />
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

        {/* Closing CTA back up to the tool */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-blue-600 px-6 py-10 text-center text-white shadow-xl shadow-primary/20">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <p className="relative text-xl sm:text-2xl font-black tracking-tight text-balance mb-2">{ctaTitle}</p>
          <p className="relative text-sm text-white/80 font-medium mb-6">
            Gratis dan langsung jalan dari browser, tanpa install aplikasi.
          </p>
          <a
            href="#"
            className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white text-primary font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUp className="w-4 h-4" />
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
