import React from "react";

interface LandingTitleProps {
  title: string;
  /** Optional emphasized tail of the title, set apart by `highlightClassName`. */
  highlight?: string;
  highlightClassName?: string;
}

/**
 * The "title + highlighted tail" text of a landing heading (CMS LandingHeader
 * shape). Renders only the text, so each section keeps its own h1/h2 element.
 */
export const LandingTitle = ({ title, highlight, highlightClassName = "text-primary" }: LandingTitleProps) => (
  <>
    {title}
    {highlight && (
      <>
        {" "}
        <span className={highlightClassName}>{highlight}</span>
      </>
    )}
  </>
);
