import React from "react";

const DEFAULT_MARK_CLASS = "text-primary font-bold";

/**
 * Renders CMS text where **phrases** wrapped in double asterisks are
 * emphasized (bold, primary color by default). No other markup is parsed and
 * nothing is injected as HTML, so CMS text can't break the page.
 */
export function RichText({ text, markClassName = DEFAULT_MARK_CLASS }: { text: string; markClassName?: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        // Odd segments sit between a pair of ** marks. An unclosed trailing
        // ** leaves an odd segment last; render it plain.
        i % 2 === 1 && i < parts.length - 1 ? (
          <span key={i} className={markClassName}>
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
