import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureSeoFaq {
  question: string;
  answer: string;
}

interface FeatureSeoSectionProps {
  /** Page H1 — the tool UI itself has no top-level heading. */
  title: string;
  /** Short label above the H1, e.g. the feature name. */
  eyebrow: string;
  /** 3D feature icon shown next to the eyebrow. */
  image: string;
  intro: string[];
  stepsTitle: string;
  steps: string[];
  guideHref?: string;
  guideLabel?: string;
  faqs: FeatureSeoFaq[];
  /** Closing button that scrolls back up to the tool. */
  ctaLabel: string;
  className?: string;
}

/**
 * Server-rendered explainer for interactive tool pages (split-bill, invoice,
 * collect-money, shared-goals). The tools are client-only and render a
 * loading shell on the server, so this is the text crawlers actually index.
 * Pages place it first in the DOM and push it visually below the tool with
 * `order-*`, so the tool stays the first thing users see.
 */
export function FeatureSeoSection({
  title,
  eyebrow,
  image,
  intro,
  stepsTitle,
  steps,
  guideHref,
  guideLabel = "Lihat panduan lengkapnya",
  faqs,
  ctaLabel,
  className,
}: FeatureSeoSectionProps) {
  const [lead, ...rest] = intro;

  return (
    <section
      aria-labelledby="feature-seo-title"
      className={cn("w-full bg-background flex justify-center border-t border-primary/10", className)}
    >
      <div className="w-full max-w-[600px] px-4 pt-10 pb-20 space-y-10">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
              <Image src={image} alt="" width={44} height={44} sizes="44px" className="w-11 h-11 object-contain" />
            </div>
            <span className="inline-flex items-center border border-primary/20 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full">
              {eyebrow}
            </span>
          </div>
          <h1
            id="feature-seo-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight"
          >
            {title}
          </h1>
          {lead && (
            <p className="text-base text-muted-foreground font-medium leading-relaxed">{lead}</p>
          )}
        </header>

        {rest.length > 0 && (
          <div className="bg-white border border-primary/10 rounded-sm shadow-soft p-5 space-y-3">
            {rest.map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Quick steps as a numbered timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-foreground">{stepsTitle}</h2>
          <ol className="relative">
            {steps.map((step, i) => (
              <li key={i} className="relative flex gap-4 pb-4 last:pb-0">
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-4 top-8 bottom-0 w-px bg-primary/20" />
                )}
                <span className="relative z-10 w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  {i + 1}
                </span>
                <span className="flex-1 bg-white border border-primary/10 rounded-sm px-4 py-3 text-sm font-medium text-foreground/80 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          {guideHref && (
            <Link
              href={guideHref}
              className="group flex items-center justify-center gap-2 w-full h-12 rounded-sm border border-primary/20 bg-white text-primary text-sm font-bold hover:bg-primary/5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {guideLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {faqs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-foreground">Pertanyaan yang sering ditanya</h2>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-white border border-primary/10 rounded-sm overflow-hidden shadow-soft open:border-primary/30 transition-colors"
                >
                  <summary className="list-none [&::-webkit-details-marker]:hidden px-4 py-4 flex items-center justify-between gap-4 cursor-pointer text-sm font-bold text-foreground/80 group-open:text-primary">
                    {faq.question}
                    <span className="w-6 h-6 rounded-full bg-primary/5 text-primary/60 flex items-center justify-center shrink-0 transition-all group-open:rotate-45 group-open:bg-primary group-open:text-white">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </summary>
                  <p className="px-4 pb-4 pt-3 text-sm text-muted-foreground leading-relaxed border-t border-primary/5">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Closing CTA back to the tool at the top of the page */}
        <div className="rounded-sm bg-gradient-to-br from-primary to-blue-600 p-6 text-center text-white shadow-lg shadow-primary/20">
          <p className="text-lg font-black mb-1">Siap dicoba?</p>
          <p className="text-sm text-white/80 font-medium mb-4">Gratis dan langsung jalan dari browser.</p>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-sm bg-white text-primary text-sm font-black hover:bg-white/90 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Pick FAQ entries by id from the shared faqData, keeping the given order. */
export function pickFaqs<T extends { id: string; question: string; answer: string }>(
  data: T[],
  ids: string[],
): FeatureSeoFaq[] {
  return ids
    .map((id) => data.find((f) => f.id === id))
    .filter((f): f is T => !!f)
    .map(({ question, answer }) => ({ question, answer }));
}
