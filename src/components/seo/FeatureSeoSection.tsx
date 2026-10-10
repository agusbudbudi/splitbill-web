import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen } from "lucide-react";
import { CaraPakaiOverview } from "@/components/cara-pakai";
import { FAQSectionHomepage } from "@/components/homepage/FAQSectionHomepage";
import type { FeatureSeoContent } from "@/data/featureSeoContent";
import { cn } from "@/lib/utils";

/**
 * Server-rendered explainer for interactive tool pages (split-bill, invoice,
 * collect-money, shared-goals), in the same visual language as the
 * /[fitur]/cara-pakai pages. The tools are client-only and render a loading
 * shell on the server, so this is the text crawlers actually index. Pages
 * place it first in the DOM and push it visually below the tool with
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
    <div className={cn("w-full bg-white border-t border-slate-100", className)}>
      {/* "Apa itu" overview, carries the page H1 */}
      <CaraPakaiOverview
        headingLevel="h1"
        titlePrefix={titlePrefix}
        titleHighlight={titleHighlight}
        description={lead}
        points={points}
      />

      {/* Quick steps */}
      <section className="py-16 sm:py-24 bg-[#f8f9fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Cara Cepat{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary">
                {stepsTitleHighlight}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-medium">{stepsSubtitle}</p>
          </div>

          <ol
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6",
              steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4",
            )}
          >
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="relative flex sm:flex-col items-start gap-4 bg-white rounded-md p-4 sm:p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]"
              >
                <span className="absolute top-3 right-4 text-4xl sm:text-5xl font-black text-primary/10 leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center p-2.5 shrink-0">
                  <step.icon className="w-full h-full text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {guideHref && (
            <div className="flex justify-center mt-8 sm:mt-10">
              <Link
                href={guideHref}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-primary/20 bg-white text-primary font-bold text-sm sm:text-base hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                {guideLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ, same component as the homepage and cara-pakai pages */}
      <FAQSectionHomepage
        faqs={faqs}
        title={
          <>
            Pertanyaan Seputar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {featureName}
            </span>
          </>
        }
      />

      {/* Closing CTA back up to the tool */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28 bg-white">
        <div className="max-w-7xl mx-auto rounded-xl bg-gradient-to-br from-primary to-blue-600 px-6 py-10 sm:py-14 text-center text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <p className="relative text-2xl sm:text-3xl font-black tracking-tight mb-2">{ctaTitle}</p>
          <p className="relative text-sm sm:text-base text-white/80 font-medium mb-6">
            Gratis dan langsung jalan dari browser, tanpa install aplikasi.
          </p>
          <a
            href="#"
            className="relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-md bg-white text-primary font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUp className="w-4 h-4" />
            {ctaLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
