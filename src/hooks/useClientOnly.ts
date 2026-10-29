import { useSyncExternalStore } from "react";
import { isNativeAppWebView } from "@/lib/utils";

// These values never change after load, so there is nothing to subscribe to.
const subscribe = () => () => {};

/** false on the server and during hydration, true afterwards — without a setState-in-effect re-render. */
export const useIsHydrated = () => useSyncExternalStore(subscribe, () => true, () => false);

/** Whether the page runs inside the SplitBill native app's webview (always false on the server). */
export const useIsNativeApp = () => useSyncExternalStore(subscribe, isNativeAppWebView, () => false);

/** Reads a sessionStorage flag after hydration (false on the server). */
export const useSessionFlag = (key: string) =>
  useSyncExternalStore(subscribe, () => sessionStorage.getItem(key) === "true", () => false);
