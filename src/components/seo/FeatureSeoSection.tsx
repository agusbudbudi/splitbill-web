import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureSeoFaq {
  question: string;
  answer: string;
}

interface FeatureSeoSectionProps {
  /** Page H1 — the tool UI itself has no top-level heading. */
  title: string;
  intro: string[];
  stepsTitle: string;
  steps: string[];
  guideHref?: string;
  guideLabel?: string;
  faqs: FeatureSeoFaq[];
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
  intro,
  stepsTitle,
  steps,
  guideHref,
  guideLabel = "Lihat panduan lengkapnya",
  faqs,
  className,
}: FeatureSeoSectionProps) {
  return (
    <section
      aria-labelledby="feature-seo-title"
      className={cn("w-full bg-background flex justify-center", className)}
    >
      <div className="w-full max-w-[600px] px-4 pt-6 pb-28 space-y-8">
        <div className="space-y-3">
          <h1
            id="feature-seo-title"
            className="text-2xl font-black tracking-tight text-foreground leading-tight"
          >
            {title}
          </h1>
          {intro.map((paragraph, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">{stepsTitle}</h2>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          {guideHref && (
            <Link
              href={guideHref}
              className="inline-block text-sm font-bold text-primary hover:underline"
            >
              {guideLabel}
            </Link>
          )}
        </div>

        {faqs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Pertanyaan yang sering ditanya</h2>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-white border border-primary/10 rounded-md overflow-hidden shadow-soft"
                >
                  <summary className="list-none [&::-webkit-details-marker]:hidden px-5 py-4 flex items-center justify-between gap-4 cursor-pointer text-sm font-bold text-foreground/80 group-open:text-primary">
                    {faq.question}
                    <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 pt-1 text-xs lg:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
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
