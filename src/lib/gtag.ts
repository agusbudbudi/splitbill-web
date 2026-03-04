import { sendGAEvent } from "@next/third-parties/google";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Log a custom event to Google Analytics
 * @param eventName Name of the event
 * @param eventParams Additional parameters for the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Event]: ${eventName}`, eventParams);
    }
    sendGAEvent({ event: eventName, ...eventParams });
  }
};

/**
 * Identify user with User-ID and set base properties
 * @param userId Unique identifier for the user
 * @param properties Additional user properties
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Identify]: ${userId}`, properties);
    }
    window.gtag("config", GA_MEASUREMENT_ID!, {
      user_id: userId,
    });
    if (properties) {
      setUserProperties(properties);
    }
  }
};

/**
 * Clear user identification (on logout)
 */
export const clearUser = () => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[GA Clear User]");
    }
    window.gtag("config", GA_MEASUREMENT_ID!, {
      user_id: null,
    });
  }
};

/**
 * Set user properties
 * @param properties Key-value pairs of user attributes
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log("[GA User Properties]:", properties);
    }
    window.gtag("set", "user_properties", properties);
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Predefined Event Trackers for Consistency
 */
export const trackAuth = {
  login: () => trackEvent("login"),
  signUp: () => trackEvent("sign_up"),
};

export const trackSplitBill = {
  start: () => trackEvent("split_bill_start"),
  stepComplete: (stepNumber: number, stepName: string) => 
    trackEvent("split_bill_step_complete", { step_number: stepNumber, step_name: stepName }),
  aiScan: (status: "start" | "success" | "error") => 
    trackEvent("ai_scan_receipt", { status }),
  aiImport: () => trackEvent("ai_import_result"),
  save: (params: { total_amount: number; num_participants: number; num_items: number; activity_name: string }) => 
    trackEvent("save_split_bill", params),
  share: (method: "share_api" | "copy_link", id: string) => 
    trackEvent("share_split_bill", { method, id }),
};

export const trackPublic = {
  openBill: (billId: string) => trackEvent("open_public_bill", { bill_id: billId }),
};

export const trackSocial = {
  addFriend: () => trackEvent("add_friend"),
  tutorialComplete: () => trackEvent("tutorial_complete"),
};

export const trackGeneral = {
  appEntry: () => trackEvent("app_entry"),
};
