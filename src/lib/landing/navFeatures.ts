import type { LandingContent } from "./types";

/** The part of a landing feature card the navbar's "Fitur" tray shows. */
export type NavFeature = Pick<LandingContent["features"]["items"][number], "title" | "href" | "imageUrl" | "tone" | "badge">;

/** Expects content from mergeWithDefaults, which already drops inactive items. */
export const toNavFeatures = (features: LandingContent["features"]): NavFeature[] =>
  features.items.map(({ title, href, imageUrl, tone, badge }) => ({ title, href, imageUrl, tone, badge }));
