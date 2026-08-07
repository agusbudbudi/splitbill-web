// Plain module state on purpose (not sessionStorage): it must reset on every
// hard page load / direct URL entry, and only stay true across client-side
// SPA transitions within that same page-load session. sessionStorage would
// wrongly persist across a hard reload in the same tab.
let navigatedInApp = false;
let previousPathname: string | null = null;

/** Call after a client-side route change to mark in-app navigation and record what page it came from. */
export function markInternalNavigation(fromPathname: string) {
  navigatedInApp = true;
  previousPathname = fromPathname;
}

/**
 * True if it's safe to router.back() here: the user actually navigated
 * in-app AND the immediately preceding page wasn't /login. Auth redirects
 * bounce detail pages through /login and back — that hop isn't a real
 * entry point, so it shouldn't count as "came from a previous page".
 */
export function canGoBackInApp(): boolean {
  return navigatedInApp && previousPathname !== "/login";
}
