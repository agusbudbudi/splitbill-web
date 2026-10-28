// Long enough for the navbar's promo banner, which animates in once the page
// scrolls, to settle before the second pass re-measures the header.
const HEADER_SETTLE_MS = 300;

interface ScrollOptions {
  behavior?: ScrollBehavior;
  /** Scroll the target to the very top, under the fixed header (the hero is designed to sit there). */
  underHeader?: boolean;
}

/**
 * Scrolls a landing section to just below the fixed header. Runs twice: the
 * header grows a banner once scrolling starts, which moves the target after
 * the first measurement.
 */
export function scrollBelowHeader(target: HTMLElement, { behavior = "smooth", underHeader = false }: ScrollOptions = {}) {
  const scroll = () => {
    const header = document.querySelector("header");
    const offset = underHeader ? 0 : (header?.offsetHeight ?? 64) + 2;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior });
  };

  scroll();
  setTimeout(scroll, HEADER_SETTLE_MS);
}
